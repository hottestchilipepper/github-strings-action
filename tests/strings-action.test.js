const core = require("@actions/core");
const stringsAction = require("../strings-action");

jest.mock("@actions/core");

function createRequireErrorMessage(key) {
  return `Input required and not supplied: ${key}.`;
}

/*
 * Need to re-throw the setFailed error, because there will be caught errors
 * in the action (try-catch) that will only call setFailed, but not throw
 * another error that the tests will detect.
 * */
core.setFailed = jest.fn((arg) => {
  throw arg;
});

/**
 * Should set the input variables for
 * @param obj
 * @return {function(*, *=): *}
 */
function setCoreGetInputMock(obj) {
  if (!obj.hasOwnProperty("output_name")) {
    obj["output_name"] = "result";
  }
  core.getInput = jest.fn((key, options) => {
    let val = obj[key];
    // same check for required as used in core code: https://github.com/actions/toolkit/blob/master/packages/core/src/core.ts
    if (options && options.required && !val) {
      throw new Error(createRequireErrorMessage(key));
    }
    if (val === undefined) {
      val = "";
    }
    return val;
  });
}

describe("Check input variables.", () => {
  test("Should fail when 'value' is missing (or empty string).", () => {
    setCoreGetInputMock({});
    expect(stringsAction).toThrow(createRequireErrorMessage("value"));

    setCoreGetInputMock({ value: "" });
    expect(stringsAction).toThrow(createRequireErrorMessage("value"));
  });

  test("Should fail when 'func_name' is missing (or empty string).", () => {
    setCoreGetInputMock({ value: "abc123" });
    expect(stringsAction).toThrow(createRequireErrorMessage("func_name"));
  });

  test('Should fail when "output_name" is set to undefined or is empty.', () => {
    setCoreGetInputMock({
      value: "abc123",
      func_name: "substring",
      output_name: "",
    });
    expect(stringsAction).toThrow(createRequireErrorMessage("output_name"));

    setCoreGetInputMock({
      value: "abc123",
      func_name: "substring",
      output_name: undefined,
    });
    expect(stringsAction).toThrow(createRequireErrorMessage("output_name"));
  });
});

function setCoreExpectedOutput(obj) {
  core.setOutput = jest.fn((key, val) => {
    let expectedVal = obj[key];
    if (Array.isArray(expectedVal)) {
      if (Array.isArray(obj[key])) {
        if (
          expectedVal.length !== obj[key].length ||
          expectedVal.every((v, i) => v !== obj[key][i])
        ) {
          throw new Error(
            `When setting the output the value (${val}) for '${key}' was not the expected value (${expectedVal}).`
          );
        }
      } else {
        throw new Error(
          `When setting the output the value (${val}) for '${key}' was not the expected value (${expectedVal}).`
        );
      }
    } else if (expectedVal !== val) {
      // this in combination with the overridden setFailed will fail the tests when thrown
      throw new Error(
        `When setting the output the value (${val}) for '${key}' was not the expected value (${expectedVal}).`
      );
    }
  });
}

function setCoreExpectedFail(obj) {
  core.setFailed = jest.fn((arg) => {
    throw arg;
  });
}

describe("Check returned substring", () => {
  test("Check length of string.", () => {
    setCoreGetInputMock({ value: "abc123", func_name: "length" });
    setCoreExpectedOutput({ result: 6 });
    stringsAction();

    setCoreGetInputMock({ value: "1", func_name: "length" });
    setCoreExpectedOutput({ result: 1 });
    stringsAction();

    setCoreGetInputMock({ value: "oiwejfoiwj", func_name: "length" });
    setCoreExpectedOutput({ result: 10 });
    stringsAction();
  });

  test("Check substring from substring output.", () => {
    setCoreGetInputMock({
      value: "abc123",
      func_name: "substring",
      start: 3,
      end: 6,
    });
    setCoreExpectedOutput({ result: "123" });
    stringsAction();

    setCoreGetInputMock({
      value: "abc123",
      func_name: "substring",
      start: 3,
      end: 1,
    });
    setCoreExpectedOutput({ result: "bc" });
    stringsAction();

    setCoreGetInputMock({ value: "abc123", func_name: "substring", end: 2 });
    setCoreExpectedOutput({ result: "ab" });
    stringsAction();

    setCoreGetInputMock({ value: "abc123", func_name: "substring", start: 2 });
    setCoreExpectedOutput({ result: "c123" });
    stringsAction();

    setCoreGetInputMock({ value: "v0.0.59+4", func_name: "substring", start: 1 });
    setCoreExpectedOutput({ result: "0.0.59+4" });
    stringsAction();
  });

  test("Check index_of function.", () => {
    setCoreGetInputMock({
      value: "abc123",
      func_name: "index_of",
      index_of_str: "c1",
    });
    setCoreExpectedOutput({ result: 2 });
    stringsAction();

    setCoreGetInputMock({
      value: "abc123c1",
      func_name: "index_of",
      index_of_str: "c1",
    });
    setCoreExpectedOutput({ result: 2 });
    stringsAction();

    setCoreGetInputMock({
      value: "c1abc123c1",
      func_name: "index_of",
      index_of_str: "c1",
    });
    setCoreExpectedOutput({ result: 0 });
    stringsAction();
  });

  test("Check replace function.", () => {
    setCoreGetInputMock({
      value: "abc123",
      func_name: "replace",
      replace_str: "c1",
      replace_with_str: "1c",
    });
    setCoreExpectedOutput({ result: "ab1c23" });
    stringsAction();

    setCoreGetInputMock({
      value: "abc123c1",
      func_name: "replace",
      replace_str: "c1",
      replace_with_str: "1c",
    });
    setCoreExpectedOutput({ result: "ab1c23c1" });
    stringsAction();

    setCoreGetInputMock({
      value: "abc123c1",
      func_name: "replace",
      replace_str: "abc",
      replace_with_str: "987",
    });
    setCoreExpectedOutput({ result: "987123c1" });
    stringsAction();
  });

  test("Check replace_all function.", () => {
    setCoreGetInputMock({
      value: "abc123",
      func_name: "replace_all",
      replace_str: "c1",
      replace_with_str: "1c",
    });
    setCoreExpectedOutput({ result: "ab1c23" });
    stringsAction();

    setCoreGetInputMock({
      value: "abc123c1",
      func_name: "replace_all",
      replace_str: "c1",
      replace_with_str: "1c",
    });
    setCoreExpectedOutput({ result: "ab1c231c" });
    stringsAction();
  });

  test("Check split function.", () => {
    setCoreGetInputMock({
      value: "v1.2.3+42",
      func_name: "split",
      seperator: "+",
    });
    setCoreExpectedOutput({ result: ["v1.2.3", "42"] });
    stringsAction();

    setCoreGetInputMock({
      value: "v1.2.3+42",
      func_name: "split",
      seperator: ".",
    });
    setCoreExpectedOutput({ result: ["v1", "2", "3+42"] });
    stringsAction();

    setCoreGetInputMock({
      value: "v1.2.3+42",
      func_name: "split",
      seperator: "v",
    });
    setCoreExpectedOutput({ result: ["1.2.3+42"] });
    stringsAction();
  });

  test("Check to_camel function.", () => {
    setCoreGetInputMock({
      value: "I am a Boy",
      func_name: "to_camel",
    });
    setCoreExpectedOutput({ result: "iAmABoy" });
    stringsAction();
  });
});

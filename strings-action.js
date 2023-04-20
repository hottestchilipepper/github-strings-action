const core = require("@actions/core");

function run() {
  const value = core.getInput("value", { required: true });
  const func_name = core.getInput("func_name", { required: true });
  const outputName = core.getInput("output_name", { required: true });

  try {
    let outputStr = null;
    if (func_name === "substring") {
      const start = parseInt(core.getInput("start", { required: false }));
      const end = parseInt(core.getInput("end", { required: false }));
      if (!isNaN(start) && !isNaN(end)) {
        outputStr = value.substring(start, end);
      } else if (!isNaN(end)) {
        outputStr = value.substring(0, end);
      } else if (!isNaN(start)) {
        outputStr = value.substring(start, value.length);
      } else {
        throw "Invalid input for 'substring' function."
      }
    } else if (func_name === "index_of") {
      const indexStr = core.getInput("index_of_str", { required: true });
      const index = value.indexOf(indexStr);
      outputStr = index;
    } else if (func_name === "replace") {
      const replaceStr = core.getInput("replace_str", { required: true });
      const replaceWithStr = core.getInput("replace_with_str", {
        required: true,
      });
      outputStr = value.replace(replaceStr, replaceWithStr);
    } else if (func_name === "replace_all") {
      const replaceStr = core.getInput("replace_str", { required: true });
      const replaceWithStr = core.getInput("replace_with_str", {
        required: true,
      });
      outputStr = value.replaceAll(replaceStr, replaceWithStr);
    } else if (func_name === "replace_regex") {
      const replaceRegex = core.getInput("replace_regex", { required: true });
      const replaceWithStr = core.getInput("replace_with_str", {
        required: true,
      });
      outputStr = value.replace(new RegExp(replaceRegex, "g"), replaceWithStr);
    } else if (func_name === "length") {
      outputStr = value.length;
    } else if (func_name === "split") {
      const seperator = core.getInput("seperator", { required: true });
      outputStr = value.split(seperator);
    } else if (func_name === "trim") {
      outputStr = value.trim();
    } else if (func_name === "trim_start") {
      outputStr = value.trimStart();
    } else if (func_name === "trim_end") {
      outputStr = value.trimEnd();
    } else if (func_name === "to_lower") {
      outputStr = value.toLowerCase();
    } else if (func_name === "to_upper") {
      outputStr = value.toUpperCase();
    } else if (func_name === "to_title") {
      outputStr = value
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(" ");
    } else if (func_name === "to_sentence") {
      outputStr = value
        .split(". ")
        .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(". ");
    } else if (func_name === "to_pascal") {
      outputStr = value
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join("");
    } else if (func_name === "to_camel") {
      outputStr = value
        .split(" ")
        .map((word, index) =>
          index === 0
            ? word.toLowerCase()
            : word[0].toUpperCase() + word.substring(1).toLowerCase()
        )
        .join("");
    } else if (func_name === "to_snake") {
      outputStr = value
        .split(" ")
        .map((word) => word.toLowerCase())
        .join("_");
    } else if (func_name === "to_kebab") {
      outputStr = value
        .split(" ")
        .map((word) => word.toLowerCase())
        .join("-");
    } else if (func_name === "to_train") {
      outputStr = value
        .split(" ")
        .map((word) => word.toLowerCase())
        .join("-");
    } else if (func_name === "to_dot") {
      outputStr = value
        .split(" ")
        .map((word) => word.toLowerCase())
        .join(".");
    } else if (func_name === "to_path") {
      outputStr = value
        .split(" ")
        .map((word) => word.toLowerCase())
        .join("/");
    } else if (func_name === "to_backslash") {
      outputStr = value
        .split(" ")
        .map((word) => word.toLowerCase())
        .join("\\");
    } else if (func_name === "to_forwardslash") {
      outputStr = value
        .split(" ")
        .map((word) => word.toLowerCase())
        .join("/");
    } else if (func_name === "to_slash") {
      outputStr = value
        .split(" ")
        .map((word) => word.toLowerCase())
        .join("/");
    } else if (func_name === "to_backtick") {
      outputStr = value
        .split(" ")
        .map((word) => word.toLowerCase())
        .join("`");
    } else if (func_name === "to_tick") {
      outputStr = value
        .split(" ")
        .map((word) => word.toLowerCase())
        .join("`");
    } else {
      core.setFailed("Action failed with error: 'Invalid func_name'");
    }

    core.setOutput(outputName, outputStr);
  } catch (err) {
    core.setFailed("Action failed with error: '" + err + "'");
  }
}

module.exports = run;

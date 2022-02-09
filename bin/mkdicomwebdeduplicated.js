#! /usr/bin/env node

const { main } = require("../src");
const { configureProgram } = require("../src/program");

const defaults = {
  isStudyData: false,
  isGroup: false,
  isDeduplicate: true,
  argumentsRequired: ['input'],
  helpShort: "mkdicomwebdeduplicated",
  helpDescription:
    "Makes deduplicated instance level files from a set of DICOM part 10 files.\n" +
    "Does not write sets of deduplicated files by default.",
};
// Configure program commander
configureProgram(defaults);

main(defaults).then(() => {
  console.log("done");
});

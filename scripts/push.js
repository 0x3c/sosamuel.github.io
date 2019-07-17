/*
 * @Author: Samuel Chia
 * @Date: 2019-07-17 10:41:42
 * @Last Modified by: Samuel Chia
 * @Last Modified time: 2019-07-17 15:28:39
 */

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const date = new Date();
const Y = date.getFullYear();
const m = (date.getMonth() + 1).toString().padStart(2, 0);
const d = date
  .getDate()
  .toString()
  .padStart(2, 0);
const H = date
  .getHours()
  .toString()
  .padStart(2, 0);
const M = date
  .getMinutes()
  .toString()
  .padStart(2, 0);
const S = date
  .getSeconds()
  .toString()
  .padStart(2, 0);
const commitMsg = `Site updated: ${Y}-${m}-${d} ${H}:${M}:${S}`;

const gitAdd = async () => {
  const { stderr } = await exec("git add --all");
  if (stderr) {
    throw new Error(stderr);
  }
};

/**
 *
 * @returns boolean
 */
const hasChanged = async () => {
  const nothingChangeStr = "nothing to commit, working tree clean";
  const { stderr, stdout } = await exec("git status");
  if (stderr) {
    throw new Error(stderr);
  }
  return !stdout.includes(nothingChangeStr);
};
const gitCommit = async () => {
  const { stderr } = await exec(`git commit -m "${commitMsg}"`);
  if (stderr) {
    throw new Error(stderr);
  }
};
const gitPush = async () => {
  const { stderr } = await exec(`git push origin source:source`);
  if (stderr) {
    throw new Error(stderr);
  }
};

const runGit = async () => {
  try {
    const changed = await hasChanged();
    if (!changed) {
      console.log("Nothing changed!");
      return;
    }
    await gitAdd();
    await gitCommit();
    await gitPush();
    console.log("commit your changed files successfully!");
  } catch (error) {
    throw error;
  }
};
runGit();

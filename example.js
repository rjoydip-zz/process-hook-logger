const process_hook = require("./process_hook_logger");

console.log("info", "1");
console.log(123);
console.log(true);
console.log({ a: 1 });

process_hook();

const dayjs = require("dayjs");
const pino = require("pino");

const logger = pino(
  {
    prettyPrint: {
      colorize: false,
      ignore: "pid,hostname",
    },
    timestamp: () =>
      `,"time":"${dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss.SSS")}"`,
  },
  pino.destination("logger.log")
);

const getString = (string) => {
  return string
    .trim()
    .replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ""
    );
};

const hook_stream = (stream, callback) => {
  stream.write = ((write) => {
    return function (string, encoding, fd) {
      write.apply(stream, arguments);
      callback(string, encoding, fd);
    };
  })(stream.write);
  return () => {};
};

const unhook_stdout = hook_stream(process.stdout, (string) => {
  logger.info(getString(string));
});

const unhook_stderr = hook_stream(process.stderr, (string) => {
  logger.error(getString(string));
});

const processHook = () => {
  unhook_stdout();
  unhook_stderr();
};

module.exports = { unhook_stdout, unhook_stderr, processHook };
module.exports = processHook;

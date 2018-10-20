# HttpToCli

Daemon for forwarding HTTP REST calls to system shell.
Easy to config: Just edit `config.json`.
There is no option to specify http method. Each is taken into account.
Support for static files in indicated paths.

*Written in Typescript. Prepared for Linux OS.*

## Run

`npm start` to start without rebuild. `npm run run` for rebuild.

Port number can be determined in `config.json` in `serverPort` key or as input arg (`npm start -- --port 3000` // those `--` are very important!).

## Command line Args

| Key                           | Default value  | Override method                                  |
| ----------------------------- | -------------- | ------------------------------------------------ |
| --config {ConfigFileDir}      | `config.json`  | npm start -- --config {PathToAnotherConfigFile}  |
| --port {ServerPortNumber}     |`3000`          | npm start -- --port {AnotherPortNumber}          |

## Config

`config.json`

Example:
```
{
    "serverPort": 3000,
    "routes": [
        { "url": "/ping", "action": "echo pong" },
        { "url": "/test/:test", "action": "echo test ok {test}" },
        { "url": "/shell/:cmd", "action": "{cmd}" }
    ],
    "statics": [
        { "url": "/files", "dir": "./shared_files" }
    ]
}
```

## How to use it

After start with default config (`npm start`), hit server with `http://localhost:3000/ping`. 
You should see `pong` response. 

Hit `http://localhost:3000/shell/ls` to see list of files in this program folder (`bin`, `config.json`, `package.json` etc).
As you may noticed call with spaces, pipes or apostrophes may be not possible. `.../shell/ls -l | grep "foo"` will not work from browser or curl. So there is only one way to solve this problem. Define entry like that:

```
 { "url": "/ListOfFilesContainingFoo", "action": "ls -l | grep \"foo\"" }
```
And then call `http://localhost:3000/ListOfFilesContainingFoo` (This should respond with `EXIT: 1` and this is valid answer because `grep` returning no lines returns `1` exit code).

### Static files

To get some static resource hit `http://localhost:3000/files/file.txt`. You should see `file content` from `file.txt` from `/shared_files`.

### Limitations

There is no any. You can define as many endpoints as you want.
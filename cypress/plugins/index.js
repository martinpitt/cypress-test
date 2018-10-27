const child_process = require('child_process');

var vm_proc, ssh_args, cockpit_url;

module.exports = (on, config) => {
    on('task', {
        startVM: image => {
            // already running? happens when cypress restarts the test after visiting a baseUrl the first time
            if (vm_proc)
                return cockpit_url;

            // no, start a new VM
            return new Promise((resolve, reject) => {
                let proc = child_process.spawn("/home/martin/upstream/cockpit/bots/machine/testvm.py", [image],
                                               { stdio: ["pipe", "pipe", "inherit"] });
                let buf = "";
                vm_proc = proc.pid;
                proc.stdout.on("data", data => {
                    buf += data.toString();
                    if (buf.indexOf("\nRUNNING\n") > 0) {
                        let lines = buf.split("\n");
                        ssh_args = lines[0].split(' ').slice(1);
                        cockpit_url = lines[1];
                        resolve(cockpit_url);
                    }
                });
                proc.on("error", err => reject (err));
            });
        },

        stopVM: () => {
            process.kill(vm_proc);
            vm_proc = null;
            return null;
        },

        runVM: command => {
            res = child_process.spawnSync('ssh', ssh_args.concat(command),
                                          { stdio: ['pipe', 'pipe', 'inherit'], encoding: 'UTF-8' });
            if (res.status)
                throw new Error(`Command "${command} failed with code ${res.status}`);
            return res.stdout;
        }
    });
}
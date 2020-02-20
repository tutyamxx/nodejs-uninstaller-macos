<template>
    <div>
        <img id="node-logo" src="../assets/images/nodelogo.png">
        <div class="buttons">
            <div class="close" @click="close_uninstaller">
                <a class="closebutton">x</a>
            </div>
        </div>

        <p id="uninstall">Uninstaller</p>

        <img class="uninstall" src="../assets/images/uninstall.png" v-if="!uninstall_started" @click="uninstall_nodejs">
        <p id="uninstall-tip" v-if="!uninstall_started">Click the 🗑️ icon to uninstall Node.JS</p>

        <div class="single-chart" v-if="uninstall_started == true">
            <svg viewBox="0 0 36 36" class="circular-chart green">
                <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>

                <path class="circle" :stroke-dasharray="[parseInt(uninstall_progress_percentage) > 100 ? 100 : parseInt(uninstall_progress_percentage), 100]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <text x="18" y="20.35" class="percentage">{{parseInt(uninstall_progress_percentage) > 100 ? 100 : parseInt(uninstall_progress_percentage)}}%</text>
            </svg>
        </div>
    </div>
</template>

<script>
import util from "util";

const remote = require("electron").remote;
const exec = util.promisify(require("child_process").exec);

const bIsRoot = (process.getuid && process.getuid() === 0);

// --| Until I find a better way to run multiple sudo commands at once without prompting the password for every single command, this should work fine :/
const MacRemoveNodeFromPaths =
[
   "rm -rf ~/.npm \
   && rm -rf ~/.nvm \
   && rm -rf ~/.npmrc \
   && rm -rf ~/.node-gyp \
   && rm -rf ~/.node_repl_history \
   && rm -rf /usr/local/bin/node \
   && rm -rf /usr/local/bin/npm \
   && rm -rf /usr/local/bin/npx \
   && rm -rf /usr/local/bin/node-debug \
   && rm -rf /usr/local/bin/node-gyp \
   && rm -rf /usr/local/lib/node \
   && rm -rf /usr/local/lib/node_modules \
   && rm -rf /usr/local/include/node \
   && rm -rf /usr/local/include/node_modules \
   && rm -rf /usr/local/lib/dtrace/node.d \
   && rm -rf /usr/local/share/doc/node \
   && rm -rf /usr/local/share/systemtap/tapset/node.stp \
   && rm -rf /usr/local/lib/node_modules \
   && rm -rf /opt/local/bin/node \
   && rm -rf /opt/local/bin/node_modules \
   && rm -rf /opt/local/include/node \
   && rm -rf /opt/local/include/node_modules \
   && rm -rf /opt/local/lib/node_modules \
   && rm -rf /opt/local/lib/node \
   && rm -rf /usr/local/share/man/man1/node* \
   && rm -rf /usr/local/share/man/man1/npm* \
   && rm -rf /usr/local/share/man/man1/npx*"
];

export default
{
    data()
    {
        return {
            uninstall_started: false,
            uninstall_progress_percentage: 0
        }
    },

    methods:
    {
        execute_terminal_command: async function(szCommand)
        {
            return exec(szCommand);
        },

        get_random_num: function(iMin, iMax)
        {
            return Math.floor(Math.random() * (iMin - iMax + 1) ) + iMin;
        },

        close_uninstaller: function()
        {
            const ApplicationWindow = remote.getCurrentWindow();
            ApplicationWindow.close();
        },

        uninstall_nodejs: async function()
        {
            // --| Delete all traces and files of node.js
            this.uninstall_started = true;
            this.uninstall_progress_percentage = this.get_random_num(1, 20);

            if(!bIsRoot)
            {
                this.uninstall_progress_percentage = this.get_random_num(20, 35);

                const ShellCommandPrompt = `/usr/bin/osascript -e 'do shell script "bash -c \\\"${MacRemoveNodeFromPaths}\\\"" with administrator privileges'`;

                try
                {
                    this.uninstall_progress_percentage = this.get_random_num(35, 60);
                    await this.execute_terminal_command(ShellCommandPrompt);

                    await this.execute_terminal_command("sleep 1");
                    this.uninstall_progress_percentage = this.get_random_num(61, 90);

                    this.uninstall_progress_percentage = 100;
                    await this.execute_terminal_command("sleep 0.6");
                    await this.execute_terminal_command("afplay /System/Library/Sounds/Submarine.aiff -v 10");
                }

                catch(error)
                {
                    this.uninstall_started = false;
                    this.uninstall_progress_percentage = 0;
                }
            }

            this.uninstall_started = false;
        }
    }
}
</script>

<style>
@import '../assets/css/style.css';
</style>
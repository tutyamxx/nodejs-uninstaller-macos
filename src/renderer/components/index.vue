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
const notifier = require("node-notifier");
const path = require("path");

const bIsRoot = (process.getuid && process.getuid() === 0);

// --| Until I find a better way to run multiple sudo commands at once without prompting the password for every single command, this should work fine :/
const MacRemoveNodeFromPaths =
[
    "rm -rf ~/.npm ~/.nvm ~/.npmrc ~/.node-gyp ~/.node_repl_history \
    && rm -rf /usr/local/bin/node /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/node-debug /usr/local/bin/node-gyp \
    && rm -rf /usr/local/lib/node /usr/local/lib/node_modules /usr/local/include/node /usr/local/include/node_modules /usr/local/lib/dtrace/node.d \
    && rm -rf /usr/local/share/doc/node /usr/local/share/systemtap/tapset/node.stp /usr/local/lib/node_modules \
    && rm -rf /opt/local/bin/node /opt/local/bin/node_modules /opt/local/include/node /opt/local/include/node_modules /opt/local/lib/node_modules /opt/local/lib/node \
    && rm -rf /usr/local/share/man/man1/node* /usr/local/share/man/man1/npm* /usr/local/share/man/man1/npx*"
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

                const ShellCommandPrompt = `/usr/bin/osascript -e \
                    'do shell script "bash -c \\\"${MacRemoveNodeFromPaths}\\\"" \
                    with prompt "Node.JS Uninstaller needs the administrator privileges in order to completely remove Node.JS from your system" with administrator privileges'`;

                try
                {
                    this.uninstall_progress_percentage = this.get_random_num(35, 60);

                    await notifier.notify(
                    {
                        title: "Node.JS Uninstaller",
                        message: "♻️ Uninstalling Node.JS ...",
                        icon: path.join(__dirname, "../assets/images/uninstall.png"),
                        contentImage: path.join(__dirname, "../assets/images/garbagebin.png"),
                        timeout: 2
                    });

                    await this.execute_terminal_command(ShellCommandPrompt);

                    this.uninstall_progress_percentage = this.get_random_num(61, 90);
                    await this.execute_terminal_command("sleep 1.1");

                    this.uninstall_progress_percentage = 100;
                    await this.execute_terminal_command("afplay /System/Library/Sounds/Submarine.aiff -v 10");
                    await this.execute_terminal_command("sleep 1");

                    await notifier.notify(
                    {
                        title: "Node.JS Uninstaller",
                        message: "♻️ Uninstall complete!",
                        icon: path.join(__dirname, "../assets/images/uninstall.png"),
                        contentImage: path.join(__dirname, "../assets/images/garbagebin.png"),
                        timeout: 2
                    });             
                }

                catch(error)
                {
                    this.uninstall_started = false;
                    this.uninstall_progress_percentage = 0;

                    await notifier.notify(
                    {
                        title: "Node.JS Uninstaller",
                        message: "🚫 Uninstaller stopped!",
                        icon: path.join(__dirname, "../assets/images/uninstall.png"),
                        contentImage: path.join(__dirname, "../assets/images/garbagebin.png"),
                        timeout: 2
                    });        
                }
            }

            this.uninstall_started = false;
            this.uninstall_progress_percentage = 0;
        }
    }
}
</script>

<style>
@import '../assets/css/style.css';
</style>
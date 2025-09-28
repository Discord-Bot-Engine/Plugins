import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class FindRole {
    static type = "Find Role"
    static title(data) {
        return `Find role by ${data.get("by")} "${data.get("value")}" from "${data.get("server")}"`
    }
    static variableTypes = ["Role"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="By"></dbe-label>
            <dbe-select name="by" values="Id,Name" class="col-span-3"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Value"></dbe-label>
            <dbe-input name="value" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store role in variable"></dbe-label>
            <dbe-variable-list name="role" class="col-span-3" variableType="Role"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const by = data.get("by")
        const server = actionManager.getVariable(data.get("server"))
        let role
        if(by === "Id") {
            role = await server.roles.fetch(data.get("value"))
        } else {
            role = server.roles.cache.find(role => role.name === data.get("value"))
        }
        actionManager.setVariable(data.get("role"), role)
        actionManager.runNext()
    }
}
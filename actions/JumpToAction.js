
export default class JumpToAction {
    static type = "Jump To Action"
    static title(data) {
        return `Jump to action number ${data.get("action")}`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Action number"></dbe-label>
            <dbe-input name="action" class="col-span-3"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager, getVariable}) {
        actionManager.runningActionIndex = Number(data.get("action")) - 1
        actionManager.runNext()
    }
}
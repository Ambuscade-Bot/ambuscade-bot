import { Command, Component } from "./InteractionEssentials";
import { Ping } from "./commands/Ping";
import { Donate } from "./commands/Donate";
import { Feedback } from "./commands/Feedback";
import { Changelog } from "./commands/Changelog";
import { Base } from "./commands/Base";
import { ChangelogList } from "./components/ChangelogList";

export const Commands: Command[] = [
    Feedback,
    Donate,
    Ping,
    Changelog,
    Base,
];

export const Components: Component<any>[] = [
    ChangelogList,
];

export const GIST_ID = "2869489a25471002e80fb6b9b060ec1a";
/// $js importGist:2869489a25471002e80fb6b9b060ec1a function:main() errorInfo:true ${0+}

import { entrypoint } from "#";

const _args = args as string[];

function trimUsers(users: string[]) {
    return users.map(e => e.replace(/^@|,$/g, ""));
}

function joinUsers(users: string[]) {
    users = Array.from(new Set(users));

    if (users.length > 1) {
        return `${users.slice(0, -1).join(", ")} and ${users.at(-1)}`;
    }
    return users[0];
}

async function isEmote(emote: string) {
    return (await utils.fetchEmotes()).find(e => e.name === emote);
}

type TuckAction = "tuck" | "untuck";

const defaultEmotes = {
    tuck: "supiniOkay,FeelsOkayMan,Okayga,FeelsDankMan,ApuApustaja,PETTHEPEEPO,Okayge,OkaygeL,Gladge",
    untuck: "MEGALUL,Madge,Pepega,BRUH,Weirdga,Weirdge",
}

const dataKeys = {
    tuck: "tuck_emotes",
    untuck: "untuck_emotes"
}

async function getTuckEmote(action: TuckAction) {
    const allEmotesRaw = customData.get(dataKeys[action])
                      || channelCustomData.get(dataKeys[action])
                      || defaultEmotes[action];
    const allEmotes = (allEmotesRaw as string).split(",")
                                  .sort(() => Math.random() - 0.5); // shuffle
    return await utils.getEmote(allEmotes, "supiniOkay");
}

entrypoint("main", async (action: TuckAction = "tuck") => {
    let emote;

    if (_args.length > 1 && await isEmote(_args.at(-1)!)) {
        emote = _args.pop();
    }

    if (!emote) {
        emote = await getTuckEmote(action);
    }

    const users = trimUsers(_args);
    switch (action) {
        case "tuck":
            if (users.length === 1 && users[0].toLowerCase() === "gazatu") {
                return `${users[0]} is too smol to tuck ppL`;
            }
            return `You tucked ${_args.length > 0
                 ? `${joinUsers(users)} to bed ${emote}`
                 : `yourself to bed, I guess supiniWeirdga`} 👉 🛏️`;
        case "untuck":
            return `You pull ${_args.length > 0
                 ? `${joinUsers(users)} out of the bed ${emote}`
                 : `yourself out of the bed, I guess? supiniWeirdga`} FBCatch 🛏️`;
    }
});

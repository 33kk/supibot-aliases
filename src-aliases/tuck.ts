export const GIST_ID = "2869489a25471002e80fb6b9b060ec1a";
/// $js importGist:${GIST_ID} function:main() errorInfo:true ${0+}

import { entrypoint, isEmote, trimMentions } from "#";

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

    if (args.length > 1 && await isEmote(args.at(-1)!)) {
        emote = args.pop();
    }

    if (!emote) {
        emote = await getTuckEmote(action);
    }

    const lf = new Intl.ListFormat("en");

    const users = trimMentions(args);
    switch (action) {
        case "tuck":
            if (users.length === 1 && users[0].toLowerCase() === "gazatu") {
                return `${users[0]} is too smol to tuck ppL`;
            }
            return `You tucked ${args.length > 0
                 ? `${lf.format(users)} to bed ${emote}`
                 : `yourself to bed, I guess supiniWeirdga`} 👉 🛏️`;
        case "untuck":
            return `You pull ${args.length > 0
                 ? `${lf.format(users)} out of the bed ${emote}`
                 : `yourself out of the bed, I guess? supiniWeirdga`} FBCatch 🛏️`;
    }
});

import PoissonDiskSampling from "poisson-disk-sampling";
import sharp from "sharp";
import { Dict } from "./Essentials";
import { existsSync } from "fs";
import { join } from "path";

// * Colors

const BackgroundColors = {
    transparent: { r: 0, g: 0, b: 0, alpha: 0 },
    red: { r: 255, g: 0, b: 0, alpha: 255 },
    green: { r: 0, g: 255, b: 0, alpha: 255 },
    blue: { r: 0, g: 0, b: 255, alpha: 255 },
    white: { r: 255, g: 255, b: 255, alpha: 255 },
    black: { r: 0, g: 0, b: 0, alpha: 255 },

    mapBackground: { r: 55, g: 148, b: 110, alpha: 255 },
}

// * Text Image

const CHAR_SIZE = 8;
const TEXT_CACHE_DIR = "data/cache/text-images"; // TODO: Clear cache after restart
const UNKNWON_CHAR = "assets/sprites/font/unknown.png";
const TRIPLE_DOT = "assets/sprites/font/triple-dot.png";
const WHITESPACE = "assets/sprites/font/whitespace.png";

const FontSpriteMap = {
    '0': "assets/sprites/font/0.png",
    '1': "assets/sprites/font/1.png",
    '2': "assets/sprites/font/2.png",
    '3': "assets/sprites/font/3.png",
    '4': "assets/sprites/font/4.png",
    '5': "assets/sprites/font/5.png",
    '6': "assets/sprites/font/6.png",
    '7': "assets/sprites/font/7.png",
    '8': "assets/sprites/font/8.png",
    '9': "assets/sprites/font/9.png",
    'a': "assets/sprites/font/small-a.png",
    'b': "assets/sprites/font/small-b.png",
    'c': "assets/sprites/font/small-c.png",
    'd': "assets/sprites/font/small-d.png",
    'e': "assets/sprites/font/small-e.png",
    'f': "assets/sprites/font/small-f.png",
    'g': "assets/sprites/font/small-g.png",
    'h': "assets/sprites/font/small-h.png",
    'i': "assets/sprites/font/small-i.png",
    'j': "assets/sprites/font/small-j.png",
    'k': "assets/sprites/font/small-k.png",
    'l': "assets/sprites/font/small-l.png",
    'm': "assets/sprites/font/small-m.png",
    'n': "assets/sprites/font/small-n.png",
    'o': "assets/sprites/font/small-o.png",
    'p': "assets/sprites/font/small-p.png",
    'q': "assets/sprites/font/small-q.png",
    'r': "assets/sprites/font/small-r.png",
    's': "assets/sprites/font/small-s.png",
    't': "assets/sprites/font/small-t.png",
    'u': "assets/sprites/font/small-u.png",
    'v': "assets/sprites/font/small-v.png",
    'w': "assets/sprites/font/small-w.png",
    'x': "assets/sprites/font/small-x.png",
    'y': "assets/sprites/font/small-y.png",
    'z': "assets/sprites/font/small-z.png",
    'A': "assets/sprites/font/big-a.png",
    'B': "assets/sprites/font/big-b.png",
    'C': "assets/sprites/font/big-c.png",
    'D': "assets/sprites/font/big-d.png",
    'E': "assets/sprites/font/big-e.png",
    'F': "assets/sprites/font/big-f.png",
    'G': "assets/sprites/font/big-g.png",
    'H': "assets/sprites/font/big-h.png",
    'I': "assets/sprites/font/big-i.png",
    'J': "assets/sprites/font/big-j.png",
    'K': "assets/sprites/font/big-k.png",
    'L': "assets/sprites/font/big-l.png",
    'M': "assets/sprites/font/big-m.png",
    'N': "assets/sprites/font/big-n.png",
    'O': "assets/sprites/font/big-o.png",
    'P': "assets/sprites/font/big-p.png",
    'Q': "assets/sprites/font/big-q.png",
    'R': "assets/sprites/font/big-r.png",
    'S': "assets/sprites/font/big-s.png",
    'T': "assets/sprites/font/big-t.png",
    'U': "assets/sprites/font/big-u.png",
    'V': "assets/sprites/font/big-v.png",
    'W': "assets/sprites/font/big-w.png",
    'X': "assets/sprites/font/big-x.png",
    'Y': "assets/sprites/font/big-y.png",
    'Z': "assets/sprites/font/big-z.png",
    '&': "assets/sprites/font/ampersand.png",
    '@': "assets/sprites/font/at.png",
    '\\': "assets/sprites/font/backslash.png",
    '}': "assets/sprites/font/close-brace.png",
    ']': "assets/sprites/font/close-bracket.png",
    ')': "assets/sprites/font/close-parenthesis.png",
    ':': "assets/sprites/font/colon.png",
    ',': "assets/sprites/font/comma.png",
    '$': "assets/sprites/font/dollar.png",
    '"': "assets/sprites/font/double-quote.png",
    '=': "assets/sprites/font/equal.png",
    '!': "assets/sprites/font/exclamation.png",
    '/': "assets/sprites/font/forward-slash.png",
    '>': "assets/sprites/font/greater-than.png",
    '#': "assets/sprites/font/hash.png",
    '^': "assets/sprites/font/hat.png",
    '<': "assets/sprites/font/less-than.png",
    '-': "assets/sprites/font/minus.png",
    '{': "assets/sprites/font/open-brace.png",
    '[': "assets/sprites/font/open-bracket.png",
    '(': "assets/sprites/font/open-parenthesis.png",
    '%': "assets/sprites/font/percent.png",
    '.': "assets/sprites/font/period.png",
    '?': "assets/sprites/font/question.png",
    ';': "assets/sprites/font/semicolon.png",
    '\'': "assets/sprites/font/single-quote.png",
    '*': "assets/sprites/font/star.png",
    '~': "assets/sprites/font/tilde.png",
    '_': "assets/sprites/font/underscore.png",
    '|': "assets/sprites/font/vertical-bar.png",
} as Dict<string>;

async function generateTextImage(text: string, maxLength: number): Promise<string> {
    const canvasWidth = maxLength * CHAR_SIZE;

    let textWidth = text.length * CHAR_SIZE;
    let overflow = false;
    if (textWidth > canvasWidth) {
        textWidth = canvasWidth;
        text = text.slice(0, (canvasWidth / CHAR_SIZE) - 1) + "...";
        overflow = true;
    }

    let pos = Math.floor((canvasWidth - textWidth) / 2);

    let images = [];
    for (const char of text) {
        if (char !== ' ') {
            let sprite = UNKNWON_CHAR
            if (FontSpriteMap[char]) {
                sprite = FontSpriteMap[char];
            }
            images.push({
                input: sprite,
                left: pos,
                top: 0,
            });
        }
        pos += CHAR_SIZE;
    }

    if (overflow) {
        images.push({
            input: TRIPLE_DOT,
            left: canvasWidth - CHAR_SIZE,
            top: 0,
        });
    }

    const filePath = join(TEXT_CACHE_DIR, `${text}.png`);
    await sharp({
        create: {
            width: canvasWidth,
            height: CHAR_SIZE,
            channels: 4,
            background: BackgroundColors.transparent,
        }
    })
    .composite(images)
    .png()
    .toFile(filePath);

    return filePath;
}

export async function textImage(text: string, maxLength: number): Promise<string> {
    if (text === "")
        return WHITESPACE;

    if (existsSync(join(TEXT_CACHE_DIR, `${text}.png`)))
        return join(TEXT_CACHE_DIR, `${text}.png`);

    return generateTextImage(text, maxLength);
}

// * Map Image

export type CampPartsState = {
    crate?: boolean,
    tent?: boolean
    tent2?: boolean,
    firewood?: boolean,
    barrel?: boolean,
};

const CAMP_NAME_TOP_OFFSET = 16;
const CAMP_NAME_MAX_LENGTH = 16;
const CAMP_CANVAS_SIZE = 128;
const MAP_CANVAS_SIZE = 512;
const CAMP_MARGIN = 16;
const CAMP_COUNT = 9;
const MAP_SCALE = 4;

const CampParts = {
    CRATES: {
        input: "assets/sprites/crates.png",
        left: 26 - 4 + 16, // sprite position in 96x96 canvas - top left pixel offset inside sprite file + center of 128x128 canvas
        top: 14 - 4 + 16,
    },
    TENT: {
        input: "assets/sprites/tent.png",
        left: 9 - 1 + 16,
        top: 27 - 4 + 16,
    },
    TENT2: {
        input: "assets/sprites/tent2.png",
        left: 56 - 1 + 16,
        top: 29 - 4 + 16,
    },
    CAMPFIRE_OFF: {
        input: "assets/sprites/campfire-off.png",
        left: 35 - 5 + 16,
        top: 45 - 0 + 16,
    },
    CAMPFIRE_ON: {
        input: "assets/sprites/campfire-on.png",
        left: 35 - 5 + 16,
        top: 45 - 0 + 16,
    },
    FIREWOOD: {
        input: "assets/sprites/firewood.png",
        left: 17 - 5 + 16,
        top: 61 - 5 + 16,
    },
    BARREL: {
        input: "assets/sprites/barrel.png",
        left: 61 - 9 + 16,
        top: 59 - 8 + 16,
    },
};

async function generateCampImage(username: string, online: boolean, enabledParts: CampPartsState): Promise<Buffer> {
    let images = [];
    if (enabledParts.crate) images.push(CampParts.CRATES);
    if (enabledParts.tent) images.push(CampParts.TENT);
    if (enabledParts.tent2) images.push(CampParts.TENT2);

    if (online) images.push(CampParts.CAMPFIRE_ON)
    else images.push(CampParts.CAMPFIRE_OFF);

    if (enabledParts.firewood) images.push(CampParts.FIREWOOD);
    if (enabledParts.barrel) images.push(CampParts.BARREL);

    const textImagePath = await textImage(username, CAMP_NAME_MAX_LENGTH);
    images.push({
        input: textImagePath,
        left: 0,
        top: CAMP_NAME_TOP_OFFSET,
    })

    return sharp({
        create: {
            width: CAMP_CANVAS_SIZE,
            height: CAMP_CANVAS_SIZE,
            channels: 4,
            background: BackgroundColors.transparent,
        }
    })
    .composite(images)
    .png()
    .toBuffer();
}

function shiftMapPoint(point: [number, number]): [number, number] {
    return [
        Math.floor(point[0]),
        Math.floor(point[1])
    ];
}

function generateMapPoints(): [number, number][] {
    const pointSamplingSize = MAP_CANVAS_SIZE - CAMP_CANVAS_SIZE;
    return new PoissonDiskSampling({
        shape: [pointSamplingSize, pointSamplingSize],
        minDistance: CAMP_CANVAS_SIZE + CAMP_MARGIN,
    })
    .fill()
    .slice(0, CAMP_COUNT)
    .map(point => shiftMapPoint(point as [number, number]));
}

export async function mapImage(): Promise<Buffer> {
    const points = generateMapPoints();

    let images = [];
    for (const point of points) {
        images.push({
            input: await generateCampImage("gotura", true, {
                crate: true,
                tent: true,
                tent2: true,
                firewood: true,
                barrel: true,
            }),
            left: point[0],
            top: point[1],
        });
    }

    const unscaled = await sharp({
        create: {
            width: MAP_CANVAS_SIZE,
            height: MAP_CANVAS_SIZE,
            channels: 4,
            background: BackgroundColors.mapBackground,
        }
    })
    .composite(images)
    .png()
    .toBuffer();

    return sharp(unscaled).resize({
        width: MAP_CANVAS_SIZE * MAP_SCALE,
        height: MAP_CANVAS_SIZE * MAP_SCALE,
        kernel: sharp.kernel.nearest,
        fit: "fill",
    }).toBuffer();
}

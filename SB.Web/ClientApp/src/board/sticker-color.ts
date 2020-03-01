import { ColorDto } from '../services/services';

export class StickerColor implements ColorDto {
    constructor(
        public red: number,
        public green: number,
        public blue: number
    ) {
    }

    public static create(colorDto: ColorDto): StickerColor {
        return new StickerColor(colorDto.red, colorDto.green, colorDto.blue);
    }

    public static get default(): StickerColor {
        return new StickerColor(245, 246, 248);
    }

    public equals(color: StickerColor): boolean {
        return JSON.stringify(color) === JSON.stringify(this);
    }
}

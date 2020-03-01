import React, { useEffect, useState } from 'react';
import './SelectStickerColor.scss';
import { ServicesProvider } from '../../services/services-provider';
import { ColorDto } from '../../services/services';
import { StickerColor } from '../../board/sticker-color';

interface SelectStickerColor {
    children: never[],
    onColorSelected: (color: ColorDto | undefined) => void
}

const SelectStickerColor = ({ onColorSelected }: SelectStickerColor) => {

    const [initialized, setInitialized] = useState(false);
    const [selectedColor, setSelectedColor] = useState<StickerColor | undefined>(undefined);
    const [stickerColors, setStickerColors] = useState<Array<StickerColor>>([]);

    useEffect(() => {
        if (!initialized) {
            const stickersService = ServicesProvider.stickersService;
            stickersService.colors().then(response => {
                const colors = response.map(c => StickerColor.create(c));
                setStickerColors(colors);
                setSelectedColor(colors[0]);
            });
        }

        setInitialized(true);
    }, [initialized]);

    useEffect(() => {
        onColorSelected(selectedColor);
    }, [selectedColor]);

    const colorAsCssRgbValue = (color: ColorDto) => {
        return `rgb(${color.red}, ${color.green}, ${color.blue})`;
    };

    const colorSelected = (color: ColorDto) => {
        if (color !== selectedColor) {
            setSelectedColor(color);
        }
    };

    const colorSampleClassNames = (color: ColorDto) => {
        const classNames = ['color-sample'];

        const selected = color === selectedColor;
        if (selected) {
            classNames.push('color-selected');
        }

        return classNames.join(' ');
    };

    return (
        <div className="color-picker">
            {stickerColors.map((c, i) => (
                <div className="color-sample-container">
                    <button className={colorSampleClassNames(c)}
                            key={i}
                            style={{ backgroundColor: colorAsCssRgbValue(c) }}
                            onClick={() => colorSelected(c)}>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SelectStickerColor;

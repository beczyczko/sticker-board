import React, { useEffect, useState } from 'react';
import './SelectStickerColor.scss';
import { ServicesProvider } from '../../services/services-provider';
import { ColorDto } from '../../services/services';
import { StickerColor } from '../../board/StickerColor';

interface SelectStickerColorProps {
    children: never[],
    onColorSelected: (color: StickerColor | undefined) => void
}

const SelectStickerColor = ({ onColorSelected }: SelectStickerColorProps) => {
    const latestSelectedColorStorageKey = 'latestSelectedColor';

    const [initialized, setInitialized] = useState(false);
    const [selectedColor, setSelectedColor] = useState<StickerColor | undefined>(undefined);
    const [stickerColors, setStickerColors] = useState<Array<StickerColor>>([]);

    useEffect(() => {
        if (!initialized) {
            const stickersService = ServicesProvider.stickersService;
            stickersService.colors().then(response => {
                const colors = response.map(c => StickerColor.create(c));
                setStickerColors(colors);
            });
        }

        setInitialized(true);
    }, [initialized]);

    useEffect(() => {
        onColorSelected(selectedColor);
    }, [selectedColor]);

    useEffect(() => {
        const latestSelectedColorAsString = localStorage.getItem('latestSelectedColor');
        if (latestSelectedColorAsString) {
            const latestSelectedColor = JSON.parse(latestSelectedColorAsString) as StickerColor;
            const color = stickerColors.find(c => c.equals(latestSelectedColor));
            if (color) {
                setSelectedColor(color);
            } else {
                setSelectedColor(stickerColors[0]);
            }
        } else {
            setSelectedColor(stickerColors[0]);
        }
    }, [stickerColors]);

    const colorAsCssRgbValue = (color: StickerColor) => {
        return `rgb(${color.red}, ${color.green}, ${color.blue})`;
    };

    const colorSelected = (color: StickerColor) => {
        localStorage.setItem(latestSelectedColorStorageKey, JSON.stringify(color));
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
                <button className="color-sample-container"
                        onClick={() => colorSelected(c)}
                        key={i}>
                    <div className={colorSampleClassNames(c)}
                         style={{ backgroundColor: colorAsCssRgbValue(c) }}>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default SelectStickerColor;

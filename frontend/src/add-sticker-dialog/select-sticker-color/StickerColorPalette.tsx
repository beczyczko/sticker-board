import React, { useEffect, useState } from 'react';
import './StickerColorPalette.scss';
import { ServicesProvider } from '../../services/services-provider';
import { StickerColor } from '../../board/StickerColor';
import ColorSampleButton from './ColorSampleButton';

interface StickerColorPaletteProps {
    children: never[],
    initialColor: StickerColor | undefined,
    onColorSelected: (color: StickerColor | undefined) => void
}

const StickerColorPalette = ({ onColorSelected, initialColor }: StickerColorPaletteProps) => {
    const latestSelectedColorStorageKey = 'latestSelectedColor';

    const [initialized, setInitialized] = useState(false);
    const [selectedColor, setSelectedColor] = useState<StickerColor | undefined>(undefined);
    const [stickerColors, setStickerColors] = useState<Array<StickerColor>>([]);

    useEffect(() => {
        if (!initialized) {
            const stickersService = ServicesProvider.elementsService;
            stickersService.colors().then(response => {
                const colors = response.map(c => StickerColor.create(c));
                setStickerColors(colors);
            });
        }

        setInitialized(true);
    }, [initialized]);

    useEffect(() => {
        onColorSelected(selectedColor);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor]);

    useEffect(() => {
        if (initialColor) {
            const color = stickerColors.find(c => c.equals(initialColor));
            setSelectedColor(color);
        } else {
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
        }
    }, [initialColor, stickerColors]);

    const colorSelected = (color: StickerColor) => {
        localStorage.setItem(latestSelectedColorStorageKey, JSON.stringify(color));
        if (color !== selectedColor) {
            setSelectedColor(color);
        }
    };

    return (
        <div className="color-picker">
            {stickerColors.map((c, i) => (
                <ColorSampleButton onClick={() => colorSelected(c)}
                                   color={c}
                                   isSelected={c === selectedColor}
                                   key={i}>
                </ColorSampleButton>
            ))}
        </div>
    );
};

export default StickerColorPalette;

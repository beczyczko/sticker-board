import { StickerColor } from '../../board/StickerColor';
import './ColorSampleButton.scss';
import React from 'react';

interface ColorSampleButtonProps {
    children: never[],
    color: StickerColor,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    isSelected: boolean;
}

class ColorSampleButton extends React.Component<ColorSampleButtonProps> {
    render() {
        let { color, isSelected, onClick } = this.props;

        const colorSampleClassNames = () => {
            const classNames = ['color-sample'];

            if (isSelected) {
                classNames.push('color-selected');
            }

            return classNames.join(' ');
        };

        const colorAsCssRgbValue = (color: StickerColor) => {
            return `rgb(${color.red}, ${color.green}, ${color.blue})`;
        };

        return (
            <button className="color-sample-container"
                    onClick={e => onClick(e)}>
                <div className={colorSampleClassNames()}
                     style={{ backgroundColor: colorAsCssRgbValue(color) }}>
                </div>
            </button>
        );
    }
}

export default ColorSampleButton

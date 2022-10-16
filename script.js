class SVGText {
	constructor(jsonFontData, outputDom) {
		this._jsonFontData = jsonFontData;
		this._outputDom = outputDom;
	}
	flush() {
		if (this._outputDom) {
			this._outputDom.innerHTML = '';
		}
	}
	async writeInCaps(textString) {
		if (textString && this._outputDom) {
			textString = textString.toLowerCase();
			for (let i = 0; i < textString.length; i++) {
				const svgFont = this._jsonFontData[textString[i]];
				const textSpan = document.createElement('span');
				if (svgFont) {
					textSpan.className = `qzf-${svgFont.classSuffix} write`;
					textSpan.innerHTML = svgFont.svg;
				} else {
					textSpan.innerHTML = '&nbsp;';
				}
				this._outputDom.appendChild(textSpan);
				await new Promise((r) => setTimeout(r, 750));
			}
		}
	}
}

(function () {
	const nameFIeld = document.getElementById('name');
	const submitBtn = document.getElementById('submit');
	const fontSizeField = document.getElementById('size');
	const outputFIeld = document.getElementById('output');

	if (fontSizeField) {
		fontSizeField.addEventListener('keyup', (event) => {
			if (fontSizeField) {
				outputFIeld.style.fontSize = `${event.target.value}px`;
			}
		});
	}

	fetch('./cap_alphabets.json')
		.then((response) => response.json())
		.then((jsonFonts) => {
			if (nameFIeld) {
				nameFIeld.disabled = false;
			}
			if (submitBtn) {
				submitBtn.disabled = false;
			}
			if (outputFIeld) {
				const svgText = new SVGText(jsonFonts, outputFIeld);
				submitBtn.addEventListener('click', () => {
					let value = null;
					if (nameFIeld && nameFIeld.value) {
						value = `Hi ${nameFIeld.value}`;
					}
					svgText.flush();
					if (value) {
						svgText.writeInCaps(value);
					}
				});
			}
		})
		.catch((error) => {
			if (outputFIeld) {
				const error = document.createElement('em');
				error.style.color = 'red';
				error.innerHTML = 'Error while loading fonts';
				outputFIeld.appendChild(error);
			}
		});
})();

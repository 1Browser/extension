function getElementPath(el: Element): string {
  // Function to construct the exact path for an element
  if (!(el instanceof Element)) return '';

  const parts = [];
  while (el && el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase();

    // Add ID or classes to make the selector more specific
    if (el.id) {
      selector += `#${el.id}`;
    } else if (el.className) {
      const classes = el.className.trim().split(/\s+/);
      selector += '.' + classes.join('.');
    }

    parts.unshift(selector);
    el = el.parentElement as Element;
  }

  return parts.join(' > ');
}

export interface TextPosition {
  node: Element;
  childIndex: number;
  textIndex: number;
  textLength: number;
}
export function findExactElementWithContinuousText(characters: string[]): TextPosition[] {
  const elements = document.querySelectorAll('*:not(script):not(style):not(noscript)');
  const matchingNodes: TextPosition[] = [];

  elements.forEach(element => {
    element.childNodes.forEach((child, index) => {
      if (child.nodeType === Node.TEXT_NODE && child.textContent) {
        const textContent = child.textContent.trim();
        const textArray = Array.from(textContent);

        let longestSequence = '';
        let currentSequence = '';
        let startPos = -1;
        let i = 0;

        for (const char of textArray) {
          if (characters.includes(char)) {
            // Start or continue the sequence
            if (currentSequence === '') {
              startPos = i; // Mark the start of the new sequence
            }
            currentSequence += char;
          } else {
            // Sequence break, check for the longest
            if (currentSequence.length > longestSequence.length) {
              longestSequence = currentSequence;
            }
            currentSequence = ''; // Reset current sequence
          }
          i++;
        }

        // Final check for the last sequence
        if (currentSequence.length > longestSequence.length) {
          longestSequence = currentSequence;
          startPos = i - currentSequence.length;
        }

        // Add if the longest sequence is longer than 5 characters
        if (longestSequence.length > 5 && startPos !== -1) {
          matchingNodes.push({
            node: element,
            textIndex: startPos,
            childIndex: index,
            textLength: longestSequence.length,
          });
        }
      }
    });
  });

  return matchingNodes;
}

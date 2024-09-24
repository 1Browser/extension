export interface TextPosition {
  node: Element;
  childIndex: number;
  textIndex: number;
  textLength: number;
}

export interface TextPosition {
  node: Element;
  childIndex: number;
  textIndex: number;
  textLength: number;
}

export function highlightText(position: TextPosition, highlightClass: string = 'highlight'): void {
  const { node, childIndex, textIndex, textLength } = position;

  // Get the child node (it should be a Text node)
  const childNode = node.childNodes[childIndex];

  if (!childNode || childNode.nodeType !== Node.TEXT_NODE) {
    console.error('Child node is not a text node');
    return;
  }

  const textNode = childNode as Text; // Cast to Text node
  const textContent = textNode.nodeValue;

  if (!textContent) {
    console.error('No text content in the node');
    return;
  }

  // Extract the text before, to be highlighted, and after the highlighted part
  const beforeText = textContent.slice(0, textIndex);
  const highlightedText = textContent.slice(textIndex, textIndex + textLength);
  const afterText = textContent.slice(textIndex + textLength);

  // Create new nodes to replace the original text node
  const beforeNode = document.createTextNode(beforeText);
  const afterNode = document.createTextNode(afterText);
  const highlightNode = document.createElement('span');
  highlightNode.className = highlightClass;
  highlightNode.textContent = highlightedText;

  highlightNode.setAttribute('style', 'background-color: yellow;');

  // Replace the original text node with the new nodes (before, highlight, after)
  const parentNode = textNode.parentNode;
  if (parentNode) {
    parentNode.insertBefore(beforeNode, textNode);
    parentNode.insertBefore(highlightNode, textNode);
    parentNode.insertBefore(afterNode, textNode);
    parentNode.removeChild(textNode); // Remove the original text node
  }
}

export function getUniqueSelector(element: Node | null): string | null {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return null; // Return null if element is null or not an Element node
  }

  let currentElement = element as Element; // Safely cast Node to Element

  // If the element has an ID, use it directly because IDs are unique in the DOM
  if (currentElement.id) {
    return `#${currentElement.id}`;
  }

  // Start with the element's tag name
  let selector: string = currentElement.tagName.toLowerCase();

  // If the element has classes, include them in the selector
  if (currentElement.classList.length > 0) {
    selector += '.' + Array.from(currentElement.classList).join('.');
  }

  // Calculate nth-child index
  let sibling: Element | null = currentElement;
  let nthChild: number = 1;

  while (sibling && sibling.previousElementSibling) {
    sibling = sibling.previousElementSibling;
    nthChild++;
  }

  selector += `:nth-child(${nthChild})`;

  // Recursively find the selector for the parent and build the full path
  const parentElement = currentElement.parentElement;
  if (parentElement && parentElement.tagName.toLowerCase() !== 'html') {
    return getUniqueSelector(parentElement) + ' > ' + selector;
  } else {
    return selector;
  }
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

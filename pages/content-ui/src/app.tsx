import { useEffect, useState } from 'react';
import { Provider } from '@extension/ui';
import { Floating } from './floating';
import { decode, config } from './whisperer';
import { findExactElementWithContinuousText, getUniqueSelector, highlightText, TextPosition } from './dom';
import TextSelectionPopup from './components/PopUpBox';
import '@src/styles.css';

function addButtonAfterText(parentElement: Element, childIndex: number, textIndex: number, whisperIndex: number) {
  const textNode = parentElement.childNodes[childIndex];

  // Ensure the node at the specified index is a text node
  if (textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent) {
    console.error('The specified node is not a text node.');
    return;
  }

  // Create the button element
  const button = document.createElement('button');

  button.setAttribute('class', 'cute-button');
  button.setAttribute(
    'style',
    `
    display: inline;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    font-size: 8px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.2s ease;
  `,
  );

  button.onclick = () => {
    const originalNode = document.querySelector('.whisper-' + whisperIndex);
    console.log(originalNode);
    originalNode?.setAttribute('style', 'display: block');
  };
  button.textContent = '?';

  const newTextNode = (textNode as Text).splitText(textIndex); // Splits after the full text

  parentElement?.insertBefore(button, newTextNode);
}

export default function App() {
  const [textPosition, setTextPosition] = useState<TextPosition>({
    node: document.createElement('p'),
    childIndex: 0,
    textIndex: 0,
    textLength: 0,
  });
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    console.log('content ui loaded');

    const textPositions = findExactElementWithContinuousText(config.dict);
    console.log(textPositions);
    // test url: https://www.xiaohongshu.com/explore/66f01c43000000002503181f
    textPositions.forEach((pos, index) => {
      const whisperNode = pos.node;

      const newP = document.createElement('p');
      const whisperText = whisperNode.childNodes[pos.childIndex].textContent?.slice(
        pos.textIndex,
        pos.textIndex + pos.textLength,
      );

      if (whisperText) {
        decode(whisperText).then(decodedWhisperText => {
          addButtonAfterText(whisperNode, pos.childIndex, pos.textIndex + pos.textLength, index);

          newP.textContent = index + 1 + ': ' + decodedWhisperText;
          newP.setAttribute('class', 'whisper-' + index);
          newP.setAttribute('style', 'display: none');
          whisperNode?.parentElement?.appendChild(newP);
        });
      }
    });

    document.addEventListener('mouseup', (event: MouseEvent) => {
      let selectedText = window?.getSelection()?.toString().trim();
      const selection = window?.getSelection();

      console.log((event.target as HTMLElement).id);

      if (selection && selectedText && selectedText.length > 0) {
        console.log(selectedText);
        const range = selection.getRangeAt(0);

        if (range.startContainer?.isEqualNode(range.endContainer)) {
          const startContainer =
            range.startContainer.nodeType === 3
              ? range.startContainer.parentElement // If it's a text node, use the parent element
              : range.startContainer;

          const cssPath = getUniqueSelector(startContainer);
          let childIndex = 0;
          startContainer?.childNodes.forEach((node, index) => {
            if (node.isEqualNode(range.startContainer)) childIndex = index;
          });

          console.log('CSS Path:', cssPath, childIndex, range.startOffset, range.endOffset);
          if (cssPath) {
            const selectedNode = document.querySelector(cssPath);

            if (selectedNode) {
              const rect = range.getBoundingClientRect();
              setTextPosition({
                node: selectedNode,
                textIndex: range.startOffset,
                textLength: range.endOffset - range.startOffset,
                childIndex,
              });
              setPopupPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.screenX,
              });
              setShowPopup(true);
            }
          }
        }
      } else if ((event.target as HTMLElement).id === '1browser-extension-content-view-root') {
        // Actually I don't fully understand why
      } else {
        setShowPopup(false);
      }
    });
  }, []);

  function addLeafIconAtEnd(textPosition: TextPosition) {
    const container = textPosition.node;
    // Create the leaf icon (can be replaced with an SVG or image)
    const leafIcon = document.createElement('span');
    leafIcon.classList.add('leaf-icon');
    leafIcon.setAttribute(
      'style',
      `
      position: absolute;
      right: -1em;
      width: 16px;
      height: 16px;
      background-color: yellow;
      clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
      `,
    );

    container.appendChild(leafIcon);
  }

  return (
    <Provider>
      <Floating />
      {showPopup && (
        <TextSelectionPopup
          onHighlight={() => {
            highlightText(textPosition);
            setShowPopup(false);
          }}
          onAddNote={() => {
            console.log('hi');
            highlightText(textPosition);
            setShowPopup(false);
            addLeafIconAtEnd(textPosition);
          }}
          position={popupPosition}
        />
      )}
    </Provider>
  );
}

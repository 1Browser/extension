import { useEffect, useState } from 'react';
import { Provider } from '@extension/ui';
import { Floating } from './floating';
import { decode, config } from './whisperer';
import { findExactElementWithContinuousText } from './dom';

export default function App() {
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

  useEffect(() => {
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

    console.log('content ui loaded');
  }, []);

  return (
    <Provider>
      <Floating />
    </Provider>
  );
}

import React from 'react';

import { styled, Card, CardContent, CardHeader } from '@material-ui/core';

const Verse = styled(({ ...props }) => <div {...props} />)({
  cursor: 'pointer',
  fontSize: '1rem',
});

const Pericope = styled('div')({
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '1rem',
});

export const Passage = ({ data }) => {
  const { passage } = data;
  const { book, verses } = passage;

  return (
    <Card>
      <CardHeader title={book} />
      <CardContent>
        {
          verses.reduce(
            (acc, verse, index, arr) => {
              const { content, number } = verse;
              const { accArr, prevVerse } = acc;

              if (number === prevVerse) {
                const prevVerseObj = arr[index - 1];
                const { content: prevContent } = prevVerseObj;

                return {
                  accArr: [
                    ...accArr.slice(0, index - 1),
                    <Pericope key={prevContent}>{prevContent}</Pericope>,
                    <Verse key={content}>
                      <sup>{number}</sup> {content}
                    </Verse>,
                  ],
                  prevVerse: number,
                };
              }

              return {
                accArr: [
                  ...accArr,
                  <Verse key={content}>
                    <sup>{number}</sup>
                    <span>{content}</span>
                  </Verse>,
                ],
                prevVerse: number,
              };
            },
            { accArr: [], prevVerse: -1 }
          ).accArr
        }
      </CardContent>
    </Card>
  );
};

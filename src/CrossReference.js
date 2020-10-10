import React from 'react';

import { styled, Card, CardContent, Grid, Typography } from '@material-ui/core';

const Pericope = styled(Typography)({ fontWeight: 'bold' });

const GrowGridItem = styled(Grid)({
  flexGrow: 1,
});

export const CrossReference = ({ data }) => {
  const { passage } = data;
  const { verses } = passage;

  return (
    <Grid container spacing={2}>
      {
        verses
          .filter(verse => verse.references !== null)
          .reduce(
            (acc, verse, index, arr) => {
              const { content, number, references } = verse;
              const { accArr, prevVerse } = acc;

              if (number === prevVerse) {
                const prevVerseObj = arr[index - 1];
                const {
                  content: prevContent,
                  references: prevReferences,
                } = prevVerseObj;

                return {
                  accArr: [
                    ...accArr.slice(0, index - 1),
                    <GrowGridItem item key={prevContent}>
                      <Card>
                        <CardContent>
                          <Pericope>{prevContent}</Pericope>
                          <Typography variant="caption">
                            {prevReferences}
                          </Typography>
                        </CardContent>
                      </Card>
                    </GrowGridItem>,
                    <GrowGridItem item key={content}>
                      <Card>
                        <CardContent>
                          <Typography>
                            {number}. {content}
                          </Typography>
                          <Typography variant="caption">
                            {references}
                          </Typography>
                        </CardContent>
                      </Card>
                    </GrowGridItem>,
                  ],
                  prevVerse: number,
                };
              }

              return {
                accArr: [
                  ...accArr,
                  <GrowGridItem item key={content}>
                    <Card>
                      <CardContent>
                        <Typography>
                          {number}. {content}
                        </Typography>
                        <Typography variant="caption">{references}</Typography>
                      </CardContent>
                    </Card>
                  </GrowGridItem>,
                ],
                prevVerse: number,
              };
            },
            { accArr: [], prevVerse: -1 }
          ).accArr
      }
    </Grid>
  );
};

import React from 'react';

import { Card, CardContent, CardHeader } from '@material-ui/core';

export const Audio = ({ data }) => {
  const { audioUrl } = data;

  return (
    <Card>
      <CardHeader title="Audio" />
      <CardContent>
        <audio controls>
          <source src={audioUrl} />
        </audio>
      </CardContent>
    </Card>
  );
};

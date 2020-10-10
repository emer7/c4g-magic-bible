import React from 'react';

import { styled, Card, Grid } from '@material-ui/core';

const DivWithBackground = styled(({ src, ...props }) => <div {...props} />)({
  height: 0,
  paddingTop: '56.25%',
  backgroundImage: ({ src }) => `url(${src})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
});

const DistancedCard = styled(Card)({
  marginTop: '12px',
  '&:first-child': {
    margin: 0,
  },
});

export const Pictures = ({ data }) => {
  const { images } = data;

  return images.map(image => (
    <DistancedCard>
      <DivWithBackground src={image} />
    </DistancedCard>
  ));
};

import React from 'react';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import {
  CssBaseline,
  styled,
  makeStyles,
  AppBar,
  IconButton,
  Toolbar,
  Grid,
  Typography,
  Button,
  Slide,
  BottomNavigation,
  BottomNavigationAction,
  Tabs,
  Tab,
  Paper,
} from '@material-ui/core';
import {
  Home as HomeIcon,
  Equalizer as EqualizerIcon,
  PhotoCamera as PhotoCameraIcon,
  Publish as PublishIcon,
} from '@material-ui/icons';

import { Passage } from './Passage';
import { CrossReference } from './CrossReference';
import { Audio } from './Audio';
import { Pictures } from './Pictures';

const useStyles = makeStyles({
  iconRoot: {
    fontSize: 'calc((100vh - 56px - 56px) / 4)',
  },
});

const ImageInput = styled('input')({
  display: 'none',
});

const Container = styled(({ isTabbed, ...props }) => <div {...props} />)({
  // minHeight: ({ isTabbed }) =>
  //   isTabbed ? 'calc(100vh - 56px - 56px - 48px)' : 'calc(100vh - 56px - 56px)',
  marginBottom: '56px',
  padding: '16px',
});

const CameraBackground = styled('div')({
  height: '100vh',
  width: '100vw',
  backgroundColor: 'black',
  position: 'absolute',
  zIndex: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Preview = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
});

const BottomNavigationPositioned = styled(BottomNavigation)({
  position: 'fixed',
  bottom: 0,
  width: '100vw',
});

const BigButtonWrapper = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const VerticalWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100vh - 56px - 56px - 32px)',
});

export const App = () => {
  const classes = useStyles();

  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [isPreview, setIsPreview] = React.useState(false);

  const [view, setView] = React.useState('home');
  const [resultView, setResultView] = React.useState('passage');
  const [image, setImage] = React.useState();
  const [data, setData] = React.useState();

  const handleChangeView = (e, newView) => {
    setView(newView);
  };

  const handleSubmit = paramImage => {
    const imageToPost = paramImage || image;
    const link =
      'https://magic-bible-api.herokuapp.com/api/v1/image-to-passage';

    fetch(link, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageToPost }),
    })
      .then(res => res.json())
      .then(data => {
        setData(data);
        setView('result');
        setIsPreview(false);
      });
  };

  const handleSend = () => {
    handleSubmit(image);
  };

  const handleRetake = () => {
    setIsPreview(false);
    setIsCameraOpen(true);
  };

  const handleUploadImage = e => {
    const { files } = e.target;

    const fileReader = new FileReader();
    fileReader.onload = e => {
      const base64Representation = e.target.result;
      setImage(base64Representation);

      handleSubmit(base64Representation);
    };

    fileReader.readAsDataURL(files[0]);
  };

  const handleTakePhoto = dataUri => {
    setImage(dataUri);
    setIsPreview(true);
    setIsCameraOpen(false);
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleChangeResultView = (e, newResultView) => {
    setResultView(newResultView);
  };

  return (
    <>
      <CssBaseline />

      <Slide direction="left" in={isCameraOpen} mountOnEnter unmountOnExit>
        <CameraBackground>
          <Camera
            isImageMirror={false}
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            onTakePhotoAnimationDone={handleTakePhoto}
          />
        </CameraBackground>
      </Slide>

      <AppBar position="static">
        <Toolbar>
          {/* <IconButton edge="start" color="inherit" onClick={handleOpenDrawer}>
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6">Magic Bible</Typography>
        </Toolbar>
        {view === 'result' && (
          <Tabs
            value={resultView}
            onChange={handleChangeResultView}
            variant="scrollable"
            scrollButtons="on"
          >
            <Tab label="Passage" value="passage" />
            <Tab label="Cross References" value="crossReferences" />
            <Tab label="Audio" value="audio" />
            <Tab label="Pictures" value="picture" />
          </Tabs>
        )}
      </AppBar>

      <Container isTabbed={view === 'result'}>
        {view === 'home' ? (
          <VerticalWrapper>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              spacing={3}
            >
              {isPreview ? (
                <>
                  <Grid item>
                    <Preview src={image} />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSend}
                    >
                      Send
                    </Button>
                    <Grid item>
                      <Button color="secondary" onClick={handleRetake}>
                        Retake
                      </Button>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item>
                    <BigButtonWrapper>
                      <IconButton
                        color="primary"
                        variant="contained"
                        onClick={handleOpenCamera}
                      >
                        <PhotoCameraIcon classes={{ root: classes.iconRoot }} />
                      </IconButton>
                      <Typography variant="button">Take Photo</Typography>
                    </BigButtonWrapper>
                  </Grid>
                  <Grid item>
                    <BigButtonWrapper>
                      <IconButton
                        color="primary"
                        variant="contained"
                        component="label"
                      >
                        <PublishIcon classes={{ root: classes.iconRoot }} />
                        <ImageInput type="file" onChange={handleUploadImage} />
                      </IconButton>
                      <Typography variant="button">Upload Photo</Typography>
                    </BigButtonWrapper>
                  </Grid>
                </>
              )}
            </Grid>
          </VerticalWrapper>
        ) : view === 'result' ? (
          data ? (
            resultView === 'passage' ? (
              <Passage data={data} />
            ) : resultView === 'crossReferences' ? (
              <CrossReference data={data} />
            ) : resultView === 'audio' ? (
              <Audio data={data} />
            ) : resultView === 'picture' ? (
              <Pictures data={data} />
            ) : (
              <></>
            )
          ) : (
            <Typography varian="h4">Please upload a photo first</Typography>
          )
        ) : (
          <></>
        )}
      </Container>

      <BottomNavigationPositioned
        value={view}
        onChange={handleChangeView}
        showLabels
      >
        <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
        <BottomNavigationAction
          label="Result"
          value="result"
          icon={<EqualizerIcon />}
        />
      </BottomNavigationPositioned>
    </>
  );
};

export default App;

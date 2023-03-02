/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/self-closing-comp */
import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import hairMask from "./imgs/hairmask.png";
import hatMask1 from "./imgs/testhatmask1.png";
import hatMask2 from "./imgs/testhatmask2.png";
import hatMask3 from "./imgs/testhatmask3.png";
import hatRastaCap from "./imgs/Hat_Rastacap.png";
import hatSortingHat from "./imgs/Hat_SortingHat1.png";
import hatSortingHatBack from "./imgs/Hat_SortingHat2.png";
import sortingHatMask from "./imgs/sortinghatmask.png";
import rastaCapMask from "./imgs/rastacapmask.png";
import body from "./imgs/body_asset.png";
import face from "./imgs/face_asset.png";
import hair from "./imgs/Hair_HermioneStyleBushyHair.png";
import hairBack from "./imgs/Hair_HermioneStyleBushyHair_c2a158_Back.png";
import background from "./imgs/Background_ColoredBackgroundTexture_696B78.png";
import badMask from "./imgs/bad_mask.png";
import s from "./AvatarMaker.module.scss";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

const MaskPOC = () => {
  const drawingIdRef = useRef();
  const mainCanvasRef = useRef(null);
  const maskCanvasRef = useRef(null);

  const defaultHairImageRef = useRef(null);
  const defaultHairBackImageRef = useRef(null);
  const defaultHairMaskImageRef = useRef(null);
  const defaultHatImageRef = useRef(null);
  const defaultHatBackImageRef = useRef(null);
  const defaultHatMaskImageRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const bodyImageRef = useRef(null);
  const faceImageRef = useRef(null);

  const customHairMaskImageRef = useRef(null);
  const customHairAssetImageRef = useRef(null);
  const customHairBackAssetImageRef = useRef(null);
  const customHatMaskImageRef = useRef(null);
  const customHatAssetImageRef = useRef(null);
  const customHatBackAssetImageRef = useRef(null);

  const [activeHairAsset, setActiveHairAsset] = useState(defaultHairImageRef);
  const [activeHairBackAsset, setActiveHairBackAsset] = useState(
    defaultHairBackImageRef
  );
  const [activeHatAsset, setActiveHatAsset] = useState(defaultHatImageRef);
  const [activeHatBackAsset, setActiveHatBackAsset] = useState(
    defaultHatBackImageRef
  );
  const [activeHairMask, setActiveHairMask] = useState(defaultHairMaskImageRef);
  const [activeHatMask, setActiveHatMask] = useState(defaultHatMaskImageRef);
  const [showHatMask, setShowHatMask] = useState(false);
  const [showHairMask, setShowHairMask] = useState(false);
  const [showHat, setShowHat] = useState(true);
  const [showBody, setShowBody] = useState(true);
  const [showHair, setShowHair] = useState(true);

  const [customHatMask, setCustomHatMask] = useState("");
  const [customHatAsset, setCustomHatAsset] = useState("");
  const [customHatBackAsset, setCustomHatBackAsset] = useState("");
  const [customHairMask, setCustomHairMask] = useState("");
  const [customHairAsset, setCustomHairAsset] = useState("");
  const [customHairBackAsset, setCustomHairBackAsset] = useState("");

  const updateCustomItem = (e, setter) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = function () {
        setter(img.src);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const uploadCustomHairMask = (e) => {
    updateCustomItem(e, setCustomHairMask);
  };
  const uploadCustomHairAsset = (e) => {
    updateCustomItem(e, setCustomHairAsset);
  };
  const uploadCustomHairBackAsset = (e) => {
    updateCustomItem(e, setCustomHairBackAsset);
  };
  const uploadCustomHatAsset = (e) => {
    updateCustomItem(e, setCustomHatAsset);
  };
  const uploadCustomHatBackAsset = (e) => {
    updateCustomItem(e, setCustomHatBackAsset);
  };
  const uploadCustomHatMask = (e) => {
    updateCustomItem(e, setCustomHatMask);
  };

  const drawMaskedHairContent = (context, maskContext, hairAsset) => {
    maskContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let hatMaskImageData = {
      data: []
    };
    if (activeHatMask?.current) {
      maskContext.drawImage(
        activeHatMask?.current,
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );
      hatMaskImageData = maskContext.getImageData(
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );
      maskContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    maskContext.drawImage(
      activeHairMask?.current,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    const hairMaskImageData = maskContext.getImageData(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    maskContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const hatData = hatMaskImageData.data;
    const hairData = hairMaskImageData.data;
    const { length } = hairData;

    const clippingColors = new Set();
    for (let i = 0; i < length; i += 4) {
      // red, green, blue, and alpha
      const hairRed = hairData[i + 0];
      const hairGreen = hairData[i + 1];
      const hairBlue = hairData[i + 2];
      const hairAlpha = hairData[i + 3];

      const hatRed = hatData[i + 0];
      const hatGreen = hatData[i + 1];
      const hatBlue = hatData[i + 2];
      const hatAlpha = hatData[i + 3];

      if (
        [hatRed, hatGreen, hatBlue].every((color) => color === 0) &&
        hatAlpha === 255
      ) {
        hairData[i + 0] = 0;
        hairData[i + 1] = 0;
        hairData[i + 2] = 0;
        hairData[i + 3] = 0;
      } else if (
        [hatRed, hatGreen, hatBlue].every((color) => color === 255) &&
        hatAlpha === 255
      ) {
        clippingColors.add(`${hairRed},${hairGreen},${hairBlue},${hairAlpha}`);
      }
    }

    if (clippingColors.size > 0) {
      for (let i = 0; i < length; i += 4) {
        // red, green, blue, and alpha
        const hairRed = hairData[i + 0];
        const hairGreen = hairData[i + 1];
        const hairBlue = hairData[i + 2];
        const hairAlpha = hairData[i + 3];

        if (
          clippingColors.has(`${hairRed},${hairGreen},${hairBlue},${hairAlpha}`)
        ) {
          hairData[i + 0] = 0;
          hairData[i + 1] = 0;
          hairData[i + 2] = 0;
          hairData[i + 3] = 0;
        }
      }
    }

    if (activeHatMask?.current) {
      maskContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      maskContext.putImageData(hairMaskImageData, 0, 0);
      maskContext.globalCompositeOperation = "source-in";
      maskContext.drawImage(
        hairAsset?.current,
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );
      maskContext.globalCompositeOperation = "source-over";
    } else {
      maskContext.drawImage(
        hairAsset?.current,
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );
    }

    context.drawImage(maskContext.canvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  useEffect(() => {
    const drawCanvas = async () => {
      const context = mainCanvasRef?.current?.getContext("2d");
      const maskContext = maskCanvasRef?.current?.getContext("2d");
      if (!context || !maskContext) return;

      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      maskContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      context.imageSmoothingEnabled = false;
      context.mozImageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;
      context.msImageSmoothingEnabled = false;
      maskContext.imageSmoothingEnabled = false;
      maskContext.mozImageSmoothingEnabled = false;
      maskContext.webkitImageSmoothingEnabled = false;
      maskContext.msImageSmoothingEnabled = false;

      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      context.drawImage(
        backgroundImageRef?.current,
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );

      if (activeHatMask?.current && showHatMask)
        context.drawImage(
          activeHatMask?.current,
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );
      if (showHairMask) {
        context.globalAlpha = 0.6;
        context.drawImage(
          activeHairMask?.current,
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );
        context.globalAlpha = 1.0;
      }

      if (showHat) {
        context.drawImage(
          activeHatBackAsset?.current,
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );
      }

      if (showHair) {
        drawMaskedHairContent(context, maskContext, activeHairBackAsset);
      }

      if (showBody) {
        context.drawImage(
          bodyImageRef?.current,
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );
        context.drawImage(
          faceImageRef?.current,
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );
      }

      if (showHair) {
        drawMaskedHairContent(context, maskContext, activeHairAsset);
      }

      if (showHat) {
        context.drawImage(
          activeHatAsset?.current,
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );
      }
    };

    drawingIdRef.current = requestAnimationFrame(drawCanvas);
    return () => window.cancelAnimationFrame(drawingIdRef.current);
  }, [
    backgroundImageRef.current,
    mainCanvasRef,
    maskCanvasRef,
    activeHairMask.current,
    activeHatMask.current,
    activeHairAsset.current,
    activeHairBackAsset.current,
    activeHatAsset.current,
    activeHatBackAsset.current,
    defaultHairImageRef.current,
    showHairMask,
    showHatMask,
    showHat,
    showBody,
    showHair
  ]);

  return (
    <div className={s.container}>
      <div style={{ display: "none" }}>
        <img
          src={hair}
          alt="test"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={defaultHairImageRef}
          crossOrigin="anonymous"
        />
        <img
          src={hairBack}
          alt="test"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={defaultHairBackImageRef}
          crossOrigin="anonymous"
        />
        <img
          src={hairMask}
          alt="test"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={defaultHairMaskImageRef}
          crossOrigin="anonymous"
        />
        <img
          src={hatSortingHat}
          alt="test"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={defaultHatImageRef}
          crossOrigin="anonymous"
        />
        <img
          src={hatSortingHatBack}
          alt="test"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={defaultHatBackImageRef}
          crossOrigin="anonymous"
        />
        <img
          src={sortingHatMask}
          alt="test"
          id="sortingHatMask"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={defaultHatMaskImageRef}
          crossOrigin="anonymous"
        />
        <img
          src={background}
          alt="test"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={backgroundImageRef}
          crossOrigin="anonymous"
        />
        <img
          src={body}
          alt="test"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={bodyImageRef}
          crossOrigin="anonymous"
          style={{ opacity: 0.5 }}
        />
        <img
          src={face}
          alt="test"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={faceImageRef}
          crossOrigin="anonymous"
          style={{ opacity: 0.5 }}
        />
        <img
          src={customHatMask}
          alt="custom hat mask"
          id="customHatMask"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={customHatMaskImageRef}
          crossOrigin="anonymous"
        />
        <img
          src={customHatAsset}
          alt="custom hat asset"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={customHatAssetImageRef}
          crossOrigin="anonymous"
        />
        <img
          src={customHatBackAsset}
          alt="custom hat asset"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={customHatBackAssetImageRef}
          crossOrigin="anonymous"
        />
        <img
          src={customHairMask}
          alt="custom hair mask"
          d="customHairMask"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={customHairMaskImageRef}
          crossOrigin="anonymous"
        />
        <img
          src={customHairAsset}
          alt="custom hair asset"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={customHairAssetImageRef}
          crossOrigin="anonymous"
        />
        <img
          src={customHairBackAsset}
          alt="custom hair asset"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={customHairBackAssetImageRef}
          crossOrigin="anonymous"
        />
      </div>

      <div className={s.contentContainer}>
        <div className={s.leftPane}>
          <div className={s.previewContainerHeader}>Asset and Mask Preview</div>
          <div className={s.previewContainer}>
            <div className={s.previewItem}>
              <div className={s.previewText}> DEFAULT HAIR ASSETS </div>
              <img
                className={
                  activeHairAsset?.current === defaultHairImageRef.current
                    ? s.activePreviewImage
                    : s.previewImage
                }
                src={hair}
                alt="test"
                width={50}
                height={50}
              />
              <img
                className={
                  activeHairAsset?.current === defaultHairImageRef.current
                    ? s.activePreviewImage
                    : s.previewImage
                }
                src={hairBack}
                alt="test"
                width={50}
                height={50}
              />
              {activeHairAsset?.current !== defaultHairImageRef.current && (
                <button
                  theme="light"
                  level="primary"
                  color="gold"
                  tabIndex="-1"
                  className={s.enableButton}
                  onClick={() => {
                    setActiveHairAsset(defaultHairImageRef);
                    setActiveHairBackAsset(defaultHairBackImageRef);
                  }}
                >
                  ENABLE DEFAULT HAIR ASSET
                </button>
              )}
            </div>
            <div className={s.previewItem}>
              <div className={s.previewText}> DEFAULT HAIR MASK </div>
              <img
                className={
                  activeHairMask?.current === defaultHairMaskImageRef.current
                    ? s.activePreviewImage
                    : s.previewImage
                }
                src={hairMask}
                alt="test"
                width={100}
                height={100}
              />
              {activeHairMask?.current !== defaultHairMaskImageRef.current && (
                <button
                  theme="light"
                  level="primary"
                  color="gold"
                  tabIndex="-1"
                  className={s.enableButton}
                  onClick={() => {
                    setActiveHairMask(defaultHairMaskImageRef);
                  }}
                >
                  ENABLE DEFAULT HAIR MASK
                </button>
              )}
            </div>
            <div className={s.previewItem}>
              <div className={s.previewText}> DEFAULT HAT ASSETS </div>
              <img
                className={
                  activeHatAsset?.current === defaultHatImageRef.current
                    ? s.activePreviewImage
                    : s.previewImage
                }
                src={hatSortingHat}
                alt="test"
                width={50}
                height={50}
              />
              <img
                className={
                  activeHatAsset?.current === defaultHatImageRef.current
                    ? s.activePreviewImage
                    : s.previewImage
                }
                src={hatSortingHatBack}
                alt="test"
                width={50}
                height={50}
              />
              {activeHatAsset?.current !== defaultHatImageRef.current && (
                <button
                  theme="light"
                  level="primary"
                  color="gold"
                  tabIndex="-1"
                  className={s.enableButton}
                  onClick={() => {
                    setActiveHatAsset(defaultHatImageRef);
                    setActiveHatBackAsset(defaultHatBackImageRef);
                  }}
                >
                  ENABLE DEFAULT HAT ASSET
                </button>
              )}
            </div>
            <div className={s.previewItem}>
              <div className={s.previewText}> DEFAULT HAT MASK </div>
              <img
                className={
                  activeHatMask?.current === defaultHatMaskImageRef.current
                    ? s.activePreviewImage
                    : s.previewImage
                }
                src={sortingHatMask}
                alt="test"
                width={100}
                height={100}
              />
              {activeHatMask?.current !== defaultHatMaskImageRef.current && (
                <button
                  theme="light"
                  level="primary"
                  color="gold"
                  tabIndex="-1"
                  className={s.enableButton}
                  onClick={() => {
                    setActiveHatMask(defaultHatMaskImageRef);
                  }}
                >
                  ENABLE DEFAULT HAT MASK
                </button>
              )}
            </div>
            <div className={s.flexBreak}></div>
            <div className={s.previewItem}>
              <div className={s.previewText}> CUSTOM HAIR ASSETS </div>
              {customHairAsset && (
                <>
                  <img
                    className={
                      activeHairAsset?.current ===
                      customHairAssetImageRef?.current
                        ? s.activePreviewImage
                        : s.previewImage
                    }
                    src={customHairAsset}
                    alt="test"
                    width={50}
                    height={50}
                  />
                  {customHairBackAsset && (
                    <img
                      className={
                        activeHairAsset?.current ===
                        customHairAssetImageRef?.current
                          ? s.activePreviewImage
                          : s.previewImage
                      }
                      src={customHairBackAsset}
                      alt="test"
                      width={50}
                      height={50}
                    />
                  )}
                  {activeHairAsset?.current !==
                    customHairAssetImageRef?.current && (
                    <button
                      theme="light"
                      level="primary"
                      color="gold"
                      tabIndex="-1"
                      id="enableCustomHairAssetButton"
                      className={s.enableButton}
                      onClick={() => {
                        setActiveHairAsset(customHairAssetImageRef);
                        setActiveHairBackAsset(customHairBackAssetImageRef);
                      }}
                    >
                      ENABLE CUSTOM HAIR ASSET
                    </button>
                  )}
                </>
              )}
              {!customHairAsset && <>No custom hair asset uploaded</>}
            </div>
            <div className={s.previewItem}>
              <div className={s.previewText}> CUSTOM HAIR MASK </div>
              {customHairMask && (
                <>
                  <img
                    className={
                      activeHairMask?.current ===
                      customHairMaskImageRef?.current
                        ? s.activePreviewImage
                        : s.previewImage
                    }
                    src={customHairMask}
                    alt="test"
                    width={100}
                    height={100}
                  />
                  {activeHairMask?.current !==
                    customHairMaskImageRef?.current && (
                    <button
                      theme="light"
                      level="primary"
                      color="gold"
                      tabIndex="-1"
                      id="enableCustomHairMaskButton"
                      className={s.enableButton}
                      onClick={() => {
                        setActiveHairMask(customHairMaskImageRef);
                      }}
                    >
                      ENABLE CUSTOM HAIR MASK
                    </button>
                  )}
                </>
              )}
              {!customHairMask && <>No custom hair mask uploaded</>}
            </div>
            <div className={s.previewItem}>
              <div className={s.previewText}> CUSTOM HAT ASSETS </div>
              {customHatAsset && (
                <>
                  <img
                    className={
                      activeHatAsset?.current ===
                      customHatAssetImageRef?.current
                        ? s.activePreviewImage
                        : s.previewImage
                    }
                    src={customHatAsset}
                    alt="test"
                    width={50}
                    height={50}
                  />
                  {customHatBackAsset && (
                    <img
                      className={
                        activeHatAsset?.current ===
                        customHatAssetImageRef?.current
                          ? s.activePreviewImage
                          : s.previewImage
                      }
                      src={customHatBackAsset}
                      alt="test"
                      width={50}
                      height={50}
                    />
                  )}
                  {activeHatAsset?.current !==
                    customHatAssetImageRef?.current && (
                    <button
                      theme="light"
                      level="primary"
                      color="gold"
                      tabIndex="-1"
                      id="enableCustomHatAssetButton"
                      className={s.enableButton}
                      onClick={() => {
                        setActiveHatAsset(customHatAssetImageRef);
                        setActiveHatBackAsset(customHatBackAssetImageRef);
                      }}
                    >
                      ENABLE CUSTOM HAT ASSET
                    </button>
                  )}
                </>
              )}
              {!customHatAsset && <>No custom hat asset uploaded</>}
            </div>
            <div className={s.previewItem}>
              <div className={s.previewText}> CUSTOM HAT MASK </div>
              {customHatMask && (
                <>
                  <img
                    className={
                      activeHatMask?.current === customHatMaskImageRef?.current
                        ? s.activePreviewImage
                        : s.previewImage
                    }
                    src={customHatMask}
                    alt="test"
                    width={100}
                    height={100}
                  />
                  {activeHatMask?.current !==
                    customHatMaskImageRef?.current && (
                    <button
                      theme="light"
                      level="primary"
                      color="gold"
                      tabIndex="-1"
                      id="enableCustomHatMaskButton"
                      className={s.enableButton}
                      onClick={() => {
                        setActiveHatMask(customHatMaskImageRef);
                      }}
                    >
                      ENABLE CUSTOM HAT MASK
                    </button>
                  )}
                </>
              )}
              {!customHatMask && <>No custom hat mask uploaded</>}
            </div>
          </div>
          <hr></hr>

          <div className={s.toggleContainerHeader}>
            Asset and Mask Visibility Toggles
          </div>
          <div className={s.toggleContainer}>
            <div className={s.toggleItem}>
              <button
                id="showHairMaskButton"
                theme="light"
                level="primary"
                label={`SHOW HAIR MASK (CURRENTLY ${showHairMask})`}
                color="gold"
                tabIndex="-1"
                className={s.toggleButton}
                onClick={() => {
                  setShowHairMask(!showHairMask);
                }}
              >
                SHOW HAIR MASK{" "}
                <span style={{ color: showHairMask ? "green" : "red" }}>
                  (CURRENTLY {showHairMask ? "ON" : "OFF"})
                </span>
              </button>
            </div>
            <div className={s.toggleItem}>
              <button
                theme="light"
                level="primary"
                label={`SHOW HAT MASK (CURRENTLY ${showHatMask})`}
                color="gold"
                tabIndex="-1"
                className={s.toggleButton}
                onClick={() => {
                  setShowHatMask(!showHatMask);
                }}
              >
                SHOW HAT MASK{" "}
                <span style={{ color: showHatMask ? "green" : "red" }}>
                  (CURRENTLY {showHatMask ? "ON" : "OFF"})
                </span>
              </button>
            </div>
            <div className={s.toggleItem}>
              <button
                theme="light"
                level="primary"
                label={`SHOW HAIR (CURRENTLY ${showHair})`}
                color="gold"
                tabIndex="-1"
                className={s.toggleButton}
                onClick={() => {
                  setShowHair(!showHair);
                }}
              >
                SHOW HAIR{" "}
                <span style={{ color: showHair ? "green" : "red" }}>
                  (CURRENTLY {showHair ? "ON" : "OFF"})
                </span>
              </button>
            </div>
            <div className={s.toggleItem}>
              <button
                theme="light"
                level="primary"
                label={`SHOW HAT (CURRENTLY ${showHat})`}
                color="gold"
                tabIndex="-1"
                className={s.toggleButton}
                onClick={() => {
                  setShowHat(!showHat);
                }}
              >
                SHOW HAT{" "}
                <span style={{ color: showHat ? "green" : "red" }}>
                  (CURRENTLY {showHat ? "ON" : "OFF"})
                </span>
              </button>
            </div>
            <div className={s.toggleItem}>
              <button
                theme="light"
                level="primary"
                label={`SHOW BODY (CURRENTLY ${showBody})`}
                color="gold"
                tabIndex="-1"
                className={s.toggleButton}
                onClick={() => {
                  setShowBody(!showBody);
                }}
              >
                SHOW BODY{" "}
                <span style={{ color: showBody ? "green" : "red" }}>
                  (CURRENTLY {showBody ? "ON" : "OFF"})
                </span>
              </button>
            </div>
          </div>
          <hr></hr>

          <div className={s.uploadContainerHeader}>Custom Asset Upload</div>
          <div className={s.uploadContainer}>
            <div className={s.uploadItem}>
              <input
                type="file"
                id="customHairAssetInput"
                style={{ display: "none" }}
                onChangeCapture={uploadCustomHairAsset}
              />
              <button
                label={`UPLOAD CUSTOM HAIR ASSET`}
                color="gold"
                tabIndex="-1"
                className={s.uploadButton}
                onClick={() => {
                  document.getElementById("customHairAssetInput").click();
                }}
              >
                UPLOAD CUSTOM HAIR ASSET
              </button>
            </div>

            <div className={s.uploadItem}>
              <input
                type="file"
                id="customHairBackAssetInput"
                style={{ display: "none" }}
                onChangeCapture={uploadCustomHairBackAsset}
              />
              <button
                label={`UPLOAD CUSTOM HAIR SECONDARY/BACK ASSET`}
                color="gold"
                tabIndex="-1"
                className={s.uploadButton}
                onClick={() => {
                  document.getElementById("customHairBackAssetInput").click();
                }}
              >
                UPLOAD CUSTOM HAIR BACK ASSET
              </button>
            </div>

            <div className={s.uploadItem}>
              <input
                type="file"
                id="customHairMaskInput"
                style={{ display: "none" }}
                onChangeCapture={uploadCustomHairMask}
              />
              <button
                label={`UPLOAD CUSTOM HAIR MASK`}
                color="gold"
                tabIndex="-1"
                className={s.uploadButton}
                onClick={() => {
                  document.getElementById("customHairMaskInput").click();
                }}
              >
                UPLOAD CUSTOM HAIR MASK
              </button>
            </div>

            <div className={s.uploadItem}>
              <input
                type="file"
                id="customHatAssetInput"
                style={{ display: "none" }}
                onChangeCapture={uploadCustomHatAsset}
              />
              <button
                label={`UPLOAD CUSTOM HAT ASSET`}
                color="gold"
                tabIndex="-1"
                className={s.uploadButton}
                onClick={() => {
                  document.getElementById("customHatAssetInput").click();
                }}
              >
                UPLOAD CUSTOM HAT ASSET
              </button>
            </div>

            <div className={s.uploadItem}>
              <input
                type="file"
                id="customHatBackAssetInput"
                style={{ display: "none" }}
                onChangeCapture={uploadCustomHatBackAsset}
              />
              <button
                label={`UPLOAD CUSTOM HAT SECONDARY/BACK ASSET`}
                color="gold"
                tabIndex="-1"
                className={s.uploadButton}
                onClick={() => {
                  document.getElementById("customHatBackAssetInput").click();
                }}
              >
                UPLOAD CUSTOM HAT BACK ASSET
              </button>
            </div>

            <div className={s.uploadItem}>
              <input
                type="file"
                id="customHatMaskInput"
                style={{ display: "none" }}
                onChangeCapture={uploadCustomHatMask}
              />
              <button
                label={`UPLOAD CUSTOM HAT MASK`}
                color="gold"
                tabIndex="-1"
                className={s.uploadButton}
                onClick={() => {
                  document.getElementById("customHatMaskInput").click();
                }}
              >
                UPLOAD CUSTOM HAT MASK
              </button>
            </div>
          </div>
        </div>

        <div className={s.rightPane}>
          <div className={s.previewContainerHeader}>Preview Canvas</div>
          <canvas
            ref={mainCanvasRef}
            id="mainCanvas"
            className={s.mainCanvas}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{ border: "solid 5px" }}
          />
          <canvas
            ref={maskCanvasRef}
            id="maskCanvas"
            className={s.mainCanvas}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <hr></hr>
      <div className={s.helpContainer}>
        <h1 className={s.helpHeader}>Masking Logic Explanation</h1>
        <div className={s.helpText}>
          <h2> The Problem</h2>
          Currently, we are not able to support separate hair and hat slots in
          the avatar maker because certain hair/hat combinations are not easy to
          mask against each other cleanly.{" "}
          <p>
            For example, masking away this large curly hair asset with a small
            hat does not work:
          </p>
          <img
            src={badMask}
            alt="test"
            width={400}
            height={400}
            style={{ display: "block" }}
          />
          <h2>The Proposed Solution</h2>
          <p>
            The proposed solution is to use a two mask system where each hair
            item and each hat item have one mask image Each.
          </p>
          <h3>Hat Masks</h3>
          <p>
            Hat masks will define the safe areas underneath a hat where the hair
            can be visible, as well as areas around the hat where hair should be
            clipped away.
          </p>
          <p>
            Hat masks have two areas: white and black. <br></br>
            White areas define the edge of the area under the hat where hair
            should not be visible. Any intersection of a hair mask section and
            this white area will cause that hair section to be removed.
            <br></br>
            Black areas are hard masking areas that will remove all hair
            visibile in that area without removing the whole subsection. This is
            useful for areas above hats.
          </p>
          <p>
            Here is an example of the sorting hat mask. The black area
            represents the hat itself and the area above the hat. The white area
            represents the area under the hat where hair should not be shown.
          </p>
          <img
            src={sortingHatMask}
            alt="test"
            width={400}
            height={400}
            style={{ display: "block" }}
          />
          <h3>Hair Masks</h3>
          <p>
            Hair masks will slice the hair asset into subsections that denote
            areas of the hair that can be clipped away. By breaking the hair
            into sections, we can remove chunks of the hair asset that sit
            outside of the hat mask safe area without a harsh line. Each
            subsection within the mask will be denoted by a single color, and no
            two colors can repeat in the mask.
          </p>
          <p>
            Here is an example of a bushy hair asset mask. The hair is broken
            into subsections, each denoting an area that can be clipped away.
            Each subsection has a unique color, and no colors are repeated.
          </p>
          <img
            src={hairMask}
            alt="test"
            width={400}
            height={400}
            style={{ display: "block" }}
          />
        </div>
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<MaskPOC />, rootElement);

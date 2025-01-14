import { EventEmitter } from 'pixi.js';
import debounce from '../../utils/debounce';
import { UAParser } from 'ua-parser-js';
import {
  eEnvironmentEvents,
  eEnvironmentIntegration,
  IEnvironmentConfig,
  IEnvironmentData,
  TDevice,
  TOrientation,
} from './types';

export default class Environment extends EventEmitter {
  protected _settings: IEnvironmentConfig;
  protected _ua: UAParser.IResult;
  protected _screenWidth: number = 0;
  protected _screenHeight: number = 0;
  protected _viewportWidth: number = 0;
  protected _viewportHeight: number = 0;
  protected _maxCanvasWidth: number = 0;
  protected _maxCanvasHeight: number = 0;
  protected _resolution: number = 0;
  protected _canvasResolution: number = 0;
  protected _device: TDevice = 'desktop';
  protected _isTouch: boolean = false;
  protected _browser: string | undefined;
  protected _os: string | undefined = 'unknown';
  protected _orientation: TOrientation = 'portrait';
  protected _integration: eEnvironmentIntegration =
    eEnvironmentIntegration.NONE;

  /**
   * Returns the environment data.
   */
  public get data(): IEnvironmentData {
    return {
      screenSize: {
        width: this._screenWidth,
        height: this._screenHeight,
      },
      viewportSize: {
        width: this._viewportWidth,
        height: this._viewportHeight,
      },
      maxCanvasSize: {
        width: this._maxCanvasWidth,
        height: this._maxCanvasHeight,
      },
      resolution: this._resolution,
      canvasResolution: this._canvasResolution,
      orientation: this._orientation,
      device: this._device,
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      isDesktop: this.isDesktop,
      isTouch: this._isTouch,
      browser: this._browser,
      os: this._os,
      integration: this._integration,
    };
  }
  /**
   * Returns the canvas aspect ratio.
   */
  public get viewportAR() {
    return this._viewportWidth / this._viewportHeight;
  }
  /**
   * Returns the screen size, portrait orientation will swap the width/height reference.
   */
  public get screenSize() {
    return {
      width: this._screenWidth,
      height: this._screenHeight,
    };
  }
  /**
   * Returns the screen width in pixels.
   */
  public get screenWidth() {
    return this._screenWidth;
  }
  /**
   * Returns the screen height in pixels.
   */
  public get screenHeight() {
    return this._screenHeight;
  }
  /**
   * Returns the reference screen size with no change/swap of width/height because the orientation.
   */
  public get referenceScreenSize() {
    return {
      width: this.isPortrait ? this._screenHeight : this._screenWidth,
      height: this.isPortrait ? this._screenWidth : this._screenHeight,
    };
  }
  /**
   * Returns the device picel ratio.
   */
  public get resolution() {
    return this._resolution;
  }
  /**
   * Returns the canvas resolution, calculated from the device pixel ratio and the max canvas resolution set in the settings.
   */
  public get canvasResolution() {
    return this._canvasResolution;
  }
  /**
   * Returns the maximun canvas size, portrait orientation will swap the width/height reference.
   * It is calculated from the current screen size by the canvas resolution, also calculated.
   */
  public get maxCanvasSize() {
    return {
      width: this._maxCanvasWidth,
      height: this._maxCanvasHeight,
    };
  }
  /**
   * Returns the reference maximun canvas size with no change/swap of width/height because the orientation.
   */
  public get referenceMaxCanvasSize() {
    return {
      width: this.isPortrait ? this._maxCanvasHeight : this._maxCanvasWidth,
      height: this.isPortrait ? this._maxCanvasWidth : this._maxCanvasHeight,
    };
  }
  /**
   * Returns the current device orientation, default to "landscape".
   */
  public get orientation() {
    return this._orientation;
  }
  /**
   * Returns the current device type, default to "desktop".
   */
  public get device() {
    return this._device;
  }
  /**
   * Returns the current device OS.
   */
  public get os() {
    return this._os;
  }
  /**
   * Returns true if the device is a mobile device, default to false.
   */
  public get isMobile() {
    return this._device === 'mobile';
  }
  /**
   * Returns true if the device is a tablet device, default to false.
   */
  public get isTablet() {
    return this._device === 'tablet';
  }
  /**
   * Returns true if the device is a touch device, default to false.
   */
  public get isTouch() {
    return this._isTouch;
  }
  /**
   *  Returns true if the device is a desktop device, default to true.
   */
  public get isDesktop() {
    return this._device === 'desktop';
  }
  /**
   *  Returns true if the device is in landscape orientation, default to true.
   */
  public get isLandscape() {
    return this._orientation === 'landscape';
  }
  /**
   *  Returns true if the device is in portrait orientation, default to false.
   */
  public get isPortrait() {
    return this._orientation === 'portrait';
  }
  /**
   * Returns the current integration of the game if any.
   */
  public get integration() {
    return this._integration;
  }

  /**
   * Constructor
   */
  constructor(
    settings: IEnvironmentConfig,
    integration: eEnvironmentIntegration = eEnvironmentIntegration.NONE
  ) {
    super();

    //window.environment = this;
    this._integration = integration;
    this._settings = settings;

    // Init UA Parser
    this._ua = UAParser(window.navigator.userAgent);

    // Initial Checks in RIGHT ORDER - Do not change it
    this.checkScreen();
    this.checkTouch();
    this.checkDevice();
    this.checkOrientation();
    this.checkBrowser();
    this.checkOS();

    // Set Events
    window.addEventListener(
      'resize',
      debounce(() => {
        this.checkScreen();
      }, 300)
    );
    window.addEventListener(
      'orientationchange',
      debounce(() => this.checkOrientation(), 300)
    );
    window.addEventListener(
      'deviceorientation',
      debounce(() => this.checkOrientation(), 300)
    );
  }

  /**
   *
   */
  public checkScreen() {
    let change = false;

    // Resolution
    const resolution = window.devicePixelRatio || 1;
    if (this._resolution !== resolution) {
      this._resolution = resolution;
      change = true;
    }
    this._resolution = window.devicePixelRatio || 1;

    // Screen Size - Real size in pixels of the screen
    const screenWidth = window.screen.width * window.devicePixelRatio;
    const screenHeight = window.screen.height * window.devicePixelRatio;
    if (
      screenWidth !== this._screenWidth ||
      screenHeight !== this._screenHeight
    ) {
      this._screenWidth = screenWidth;
      this._screenHeight = screenHeight;
      change = true;
    }

    // Viewport Size - "CSS pixel" size of the screen
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    if (width !== this._viewportWidth || height !== this._viewportHeight) {
      this._viewportWidth = width;
      this._viewportHeight = height;
      change = true;
    }

    // Canvas Resolution
    this._canvasResolution = Math.min(
      this._resolution,
      this._settings.maxCanvasResolution
    );

    this._maxCanvasHeight = this._canvasResolution * this._viewportHeight;
    this._maxCanvasWidth = this._canvasResolution * this._viewportWidth;

    if (change) {
      this.emit(eEnvironmentEvents.SCREEN_SIZE_CHANGE, this.data);
    }
  }

  /**
   *
   * @returns
   */
  public checkOrientation() {
    let orientation: TOrientation = 'landscape';
    if (
      !this.isDesktop &&
      window.matchMedia('(orientation: portrait)').matches
    ) {
      orientation = 'portrait';
    }
    if (this._orientation !== orientation) {
      this._orientation = orientation;
      this.emit(eEnvironmentEvents.ORIENTATION_CHANGE, this.data);
    }
  }

  /**
   *
   */
  public checkTouch() {
    this._isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   *
   */
  public checkDevice() {
    if (this._ua.device.type === 'mobile') {
      this._device = 'mobile';
    } else if (this._ua.device.type === 'tablet') {
      this._device = 'tablet';
    } else {
      this._device = 'desktop';
    }
  }

  /**
   *
   */
  public checkBrowser() {
    this._browser = this._ua.browser.name;
  }

  /**
   *
   */
  public checkOS() {
    this._os = this._ua.os.name;
  }
}

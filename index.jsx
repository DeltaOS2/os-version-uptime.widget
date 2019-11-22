/*
  Name:         os-version-uptime.widget
  Description:  Shows OS-Version and Up-Time for Übersicht
  Created:      05.Apr.2019
  Author:       Gert Massheimer
  Version:      2.1
  History:      2.1   Extended for Catalina
                      Added auto switch icon depending on dark-/light-mode
                2.0.1 better error handling
                2.0   updated to REACT
                1.0   written in CoffeeScript
  Based on:
   OS Version Pro for Übersicht
   By Mike Pennella
   https://github.com/mpen01/os-version-pro
-------------------------------------------------------------------------*/
'use strict';

// Change the theme variable below to style the widget
// THEME OPTIONS: mono, paper, color, dark or myDark

// const theme = 'mono';
// const theme = 'paper';
const theme = 'color';
// const theme = 'dark';
/*-----------------------------------------------------------------------*/

// Show or hide the version build information in the widget
const showBuild = true;
// const showBuild  = false;
/*-----------------------------------------------------------------------*/

// Position the widget on the screen
const pos1  = 'left: .5rem';
const pos2  = 'bottom: .5rem';
/*-----------------------------------------------------------------------*/

/* --- Create the themes ------------------------------------------------*/
let labelColor, nameColor, osColor, lineColor, bkGround, uptimeColor, opacityLevel;
if (theme === 'mono' || theme === 'dark') {
  labelColor   = '#fff';     // white
  nameColor    = '#fff';     // white
  osColor      = '#fff';     // white
  lineColor    = '#fff';     // white
  uptimeColor  = '#ddd';     // light gray
  bkGround     = 'rgba(0, 0, 0, 0.5)';
  opacityLevel = '0.6';
}
else if (theme === 'paper') {
  labelColor   = '#fff';     // white
  nameColor    = '#000';     // black
  osColor      = '#000';     // black
  lineColor    = '#fff';     // white
  uptimeColor  = '#aaa';     // gray
  bkGround     = 'rgba(255, 255, 255, 1)';
  opacityLevel = '0.8';
}
else {  // theme = color
  labelColor   = '#fff';     // white
  nameColor    = '#ffa640';  // orange
  osColor      = '#7dff7d';  // light green
  lineColor    = '#00BFFF';  // light blue
  uptimeColor  = '#e6273d';  // red
  bkGround     = 'rgba(0, 0, 0, 0.5)';
  opacityLevel = '1';
}
if (theme === 'dark') {
  uptimeColor  = '#aaa';     // gray
  lineColor    = 'rgba(0, 0, 0, 0.6)';
}

/*=== DO NOT EDIT AFTER THIS LINE unless you know what you're doing! ===
========================================================================*/

// noinspection NpmUsedModulesInstalled
import { css, styled } from "uebersicht";

// noinspection JSUnusedGlobalSymbols
export const refreshFrequency = 60000; // every 60000ms = every minute

// noinspection JSUnusedGlobalSymbols
export const command = "os-version-uptime.widget/data.sh";

// noinspection JSUnusedGlobalSymbols
export const updateState = (event, previousState) => {
  if (event.error) {
    return { ...previousState, warning: `We got an error: ${event.error}` };
  }
  const [UP_Time, OS_Version, Interface] = event.output.split(/\r\n|\r|\n/g); // splitting at linebreak
  return { UP_Time, OS_Version, Interface };
};

// noinspection JSUnusedGlobalSymbols
export const render = ({UP_Time, OS_Version, Interface, error}) => {

  if (error) { // noinspection JSXNamespaceValidation
    return (
        <div>Something went wrong: <strong>{String(error)}</strong></div>
      );
  }
  else {

    /* --- Create the up-time string --------------------------------------*/
    let [d, dd, h, hh, m, mm] = UP_Time.split(" ");
    h  = h  ? h  : '';
    hh = hh ? hh : '';
    m  = m  ? m  : '';
    mm = mm ? mm : '';
    let uptime = d + ' ' + dd + ' ' + h + ' ' + hh + ' ' + m + ' ' + mm;

    /* --- Create the OS information --------------------------------------*/
    let [osName, osVersion, osBuild] = OS_Version.split(" ");
    const iconDir = 'os-version-uptime.widget/icons/';

    let icon, osRelease;
    switch (Number(osVersion.substr(0, 5))) {
      case 10.10:
        icon = iconDir + "yosemite.png";
        osRelease = ' Yosemite';
        break;
      case 10.11:
        icon = iconDir + "el_capitan.png";
        osRelease = ' El Capitan';
        break;
      case 10.12:
        icon = iconDir + "sierra.png";
        osRelease = ' Sierra';
        break;
      case 10.13:
        icon = iconDir + "high_sierra.png";
        osRelease = ' High Sierra';
        break;
      case 10.14:
        if (Interface === 'Dark') icon = iconDir + "mojave_dark.png"; else icon = iconDir + "mojave.png";
        osRelease = ' Mojave';
        break;
      case 10.15:
        if (Interface === 'Dark') icon = iconDir + "catalina_dark.png"; else icon = iconDir + "catalina.png";
        osRelease = ' Catalina';
        break;
      default:
        icon = iconDir + "mac_os.png";
    }

    if (osName === 'OSX')
      osName = osName.substr(0, 2) + " " + osName.substr(2, 1);

    /* --- Put the html together ------------------------------------------*/
    const System = () => {
      if (osName !== '') return (
        <div className={nameDiv}>
          <span className={css_osName}>{osName}</span>
          <span className={css_osRelease}>{osRelease}</span>
        </div>);
    };

    const Version = () => {
      if (osName !== '') {
        if (showBuild === true)
          return (<p className={css_osVersion}>Version {osVersion} {osBuild}</p>);
        else
          return (<p className={css_osVersion}>Version {osVersion}</p>);
      }
    };

    const NoName = () => {
      if (osName === '') return (
        <div className={noNameDiv}>
          <span className={css_osVersion}>OS info is not available</span>
        </div>);
    };

    /* --- Display the widget ---------------------------------------------*/
    if (osName !== '') return (
      <Div>
        <div><Img src={icon} alt=''/></div>
        <System/>
        <Version/>
        <p className={css_uptime}>{uptime}</p>
      </Div>);
    else return (
      <Div>
        <div><Img src={icon} alt=''/></div>
        <NoName/>
        <p className={css_uptime}>{uptime}</p>
      </Div>);
  }
};

/* --- Widget styles ----------------------------------------------------*/
// noinspection JSUnusedGlobalSymbols
export const className =`
  ${pos1};
  ${pos2};
`;

const Div = styled('div')`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  display: block;
  border: 1px solid ${lineColor};
  border-radius: .5rem;
  text-shadow: 0 0 1px ${bkGround};
  background: ${bkGround};
  opacity: ${opacityLevel};
  padding: 4px 8px 4px 6px;
`;

const Img = styled('img')`
  height: 36px;
  width: 36px;
  margin-bottom: -23px;
`;

const nameDiv = css`
 margin-top: -1.2rem;
`;

const noNameDiv = css`
 margin-top: -.5rem;
`;

const css_osName = css` 
  color: ${osColor};
  font-size: .9rem;
  font-weight: 600;
  margin-left: 43px;
  margin-top; 1px;
`;

const css_osRelease = css`
  color: ${osColor};
  font-size: .9rem;
  font-weight: 400;
  margin: 1px;
`;

const css_osVersion = css`
  color: ${nameColor};
  font-size: .5rem;
  font-weight: 400;
  text-overflow: ellipsis;
  text-shadow: none;
  padding: 0;
  margin: 0 0 0 43px;
  max-width: 100%;
`;

const css_uptime = css`
  color: ${uptimeColor};
  font-size: .5rem;
  font-weight: 400;
  text-overflow: ellipsis;
  text-shadow: none;
  padding: 0;
  margin: 0 0 0 43px;
  max-width: 100%;
`;

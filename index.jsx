/*
  Name:         os-version-uptime.widget
  Description:  Shows OS-Version and Up-Time for Übersicht
  Created:      05.Apr.2019
  Author:       Gert Massheimer
  Version:      2.0.2
  History:      2.0.2 Update for Catalina
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
// const theme = 'color';
const theme = 'dark';
//const theme = 'myDark'; // color theme with dark icon;
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
else {
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

import { css, styled } from "uebersicht";

export const refreshFrequency = 60000; // every 60000ms = every minute

export const command = "os-version-uptime.widget/data.sh";

export const updateState = (event, previousState) => {
  if (event.error) {
    return { ...previousState, warning: `We got an error: ${event.error}` };
  }
  const [OS_Version, UP_Time] = event.output.split(/\r\n|\r|\n/g); // splitting at linebreak
  return { OS_Version, UP_Time };
};

export const render = ({OS_Version, UP_Time, error}) => {

  if (error) return (
    <div>Something went wrong: <strong>{String(error)}</strong></div>
  );
  else {

    /* --- Create the up-time string --------------------------------------*/
    const upValues = UP_Time.split(" ");
    const up0 = upValues[0];
    const up1 = upValues[1];
    const up2 = upValues[2] ? upValues[2] : '';
    const up3 = upValues[3] ? upValues[3] : '';
    const up4 = upValues[4] ? upValues[4] : '';
    const up5 = upValues[5] ? upValues[5] : '';
    const uptime = up0 + ' ' + up1 + ' ' + up2 + ' ' + up3 + ' ' + up4 + ' ' + up5;

    /* --- Create the OS information --------------------------------------*/
    const osValues  = OS_Version.split(" ");
    let   osName    = osValues[0];
    const osVersion = osValues[1];
    const osBuild   = osValues[2];

    const iconDir = 'os-version-uptime.widget/icons/';

    let icon, osRelease;
    switch (osVersion.substr(0, 5)) {
      case '10.10':
        icon = iconDir + "yosemite.png";
        osRelease = ' Yosemite';
        break;
      case '10.11':
        icon = iconDir + "el_capitan.png";
        osRelease = ' El Capitan';
        break;
      case '10.12':
        icon = iconDir + "sierra.png";
        osRelease = ' Sierra';
        break;
      case '10.13':
        icon = iconDir + "high_sierra.png";
        osRelease = ' High Sierra';
        break;
      case '10.14':
        if (theme === 'dark' || theme === 'myDark') icon = iconDir + "mojave_dark.png";
        else icon = iconDir + "mojave.png";
        osRelease = ' Mojave';
        break;
      case '10.15':
        if (theme === 'dark' || theme === 'myDark') icon = iconDir + "catalina_dark.png";
        else icon = iconDir + "catalina.png";
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

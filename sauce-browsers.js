'use strict';

function firefox(version)
{
        version = String(version);
        exports['SL_Firefox_'+version] = {
                version: version,
                base: 'SauceLabs',
                browserName: 'firefox'
        }
}

function chrome(version)
{
        version = String(version);
        exports['SL_Chrome_'+version] = {
                version: version,
                base: 'SauceLabs',
                browserName: 'chrome'
        }
}

function explorer(version)
{
        version = String(version);
        exports['SL_IE_' + version] = {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                version: version
        };
}

function safari(version)
{
        exports['SL_Safari_' + version] = {
                base: 'SauceLabs',
                browserName: 'safari',
                version: version
        };
}

function androidChrome(version)
{
        version = String(version);
        exports['SL_Android_' + version] = {
                base: 'SauceLabs',
                browserName: 'android',
                version: version
        };
}

function iPadSafari(version)
{
        version = String(version);
        exports['SL_iPad_' + version] = {
                base: 'SauceLabs',
                browserName: 'iPad',
                version: version
        };
}

var v;

for (v =  4; v <= 37; ++v) { firefox(v); }
for (v = 26; v <= 43; ++v) { chrome(v); }
for (v =  9; v <= 11; ++v) { explorer(v); }
for (v =  5; v <=  8; ++v) { safari(v); }
androidChrome('5.1');
androidChrome('5.0');
androidChrome('4.4');
androidChrome('4.3');
androidChrome('4.2');
androidChrome('4.1');
androidChrome('4.0');
iPadSafari('8.2');
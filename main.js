if(SugarSight === undefined) var SugarSight = {};
SugarSight.name = 'Sugar Sight';
SugarSight.version = '1.052';
SugarSight.GameVersion = '2.052';

SugarSight.launch = function(){
	SugarSight.init = function(){
		SugarSight.isLoaded = 1;
		SugarSight.Backup = {};
		SugarSight.config = {};
		
		SugarSight.config = SugarSight.defaultConfig();
		if(CCSE.config.OtherMods.SugarSight && !Game.modSaveData[SugarSight.name]) Game.modSaveData[SugarSight.name] = JSON.stringify(CCSE.config.OtherMods.SugarSight);
		Game.customOptionsMenu.push(function(){
			CCSE.AppendCollapsibleOptionsMenu(SugarSight.name, SugarSight.getMenuString());
		});
		Game.customStatsMenu.push(function(){
			CCSE.AppendStatsVersionNumber(SugarSight.name, SugarSight.version);
		});
		
		Game.customLumpTooltip.push(function(str){
			var colour = "";
			var name = SugarSight.getLumpName();
			colour = SugarSight.config.colorOverride[name];
			str = str.replace(loc("&bull; Sugar lumps can be harvested when mature, though if left alone beyond that point they will start ripening (increasing the chance of harvesting them) and will eventually fall and be auto-harvested after some time.<br>&bull; Sugar lumps are delicious and may be used as currency for all sorts of things.<br>&bull; Once a sugar lump is harvested, another one will start growing in its place.<br>&bull; Note that sugar lumps keep growing when the game is closed.")+'</div>',
			loc("&bull; Sugar lumps can be harvested when mature, though if left alone beyond that point they will start ripening (increasing the chance of harvesting them) and will eventually fall and be auto-harvested after some time.<br>&bull; Sugar lumps are delicious and may be used as currency for all sorts of things.<br>&bull; Once a sugar lump is harvested, another one will start growing in its place.<br>&bull; Note that sugar lumps keep growing when the game is closed.")+
			'<div class="line"></div>Your current lump is: <b style="color:'+colour+';">'+name+'</b></div>');
			return str;
		});
		Game.customClickLump.push(function(){
			if(SugarSight.config.soundToggles[SugarSight.getLumpName()]) Game.playGoldenCookieChime();
		});
		
		//***********************************
		//    Post-Load Hooks 
		//    To support other mods interfacing with this one
		//***********************************
		if(SugarSight.postloadHooks) {
			for(var i = 0; i < SugarSight.postloadHooks.length; ++i) {
				SugarSight.postloadHooks[i]();
			}
		}

		if (Game.prefs.popups) Game.Popup(SugarSight.name + ' loaded!');
		else Game.Notify(SugarSight.name + ' loaded!', '', '', 1, 1);
	}

	SugarSight.getLumpName = function(){
		var name = "";
		if(Game.lumpCurrentType == 0) {// Normal
			name = "Normal";
		} else if(Game.lumpCurrentType == 1) {// Bifurcated
			name = "Bifurcated";
		} else if(Game.lumpCurrentType == 2) {// Golden
			name = "Golden";
		} else if(Game.lumpCurrentType == 3) {// Meaty
			name = "Meaty";
		} else if(Game.lumpCurrentType == 4) {// Caramelized
			name = "Caramelized";
		}
		return name;
	}

	//***********************************
	//    Configuration
	//***********************************
	SugarSight.save = function(){
		return JSON.stringify(SugarSight.config);
	}

	SugarSight.load = function(str){
		var config = JSON.parse(str);
		for(var pref in config){
			SugarSight.config[pref] = config[pref];
		}
	}

	SugarSight.defaultConfig = function(){
		return {
			colorOverride: {
				'Normal'		: "#FFFFFF",
				'Bifurcated'	: "#00FFFF",
				'Golden'		: "#00FF00",
				'Meaty'			: "#FF0000",
				'Caramelized'	: "#FF8000"
			},
			soundToggles: {
				'Normal'		: false,
				'Bifurcated'	: false,
				'Golden'		: true,
				'Meaty'			: false,
				'Caramelized'	: false
			}
		}
	}

	SugarSight.SetOverrideColor = function(effect, color){
		SugarSight.config.colorOverride[effect] = color;
		Game.UpdateMenu();
	}

	SugarSight.getMenuString = function(){
		let m = CCSE.MenuHelper;

		var str = m.Header('Lump Type Settings') +
				'<div class="listing">Set color coding and sound options for each lump type. Note: Will only play sounds if the sound selector is unlocked and a sound is selected.</div>';

		for(var color in SugarSight.config.colorOverride){
			var style = 'width:65px;' +
						'background-color:'  + SugarSight.config.colorOverride[color] + ';';
			str += '<div class="listing">' +
				m.CheckBox(SugarSight.config.soundToggles, color, 'lump'+color+'Button', color, color, "SugarSight.Toggle") +
				'<input id="SugarSightColorOverride' + color + '" class="option" style="' + style + '" value="' + SugarSight.config.colorOverride[color] + '" onChange="SugarSight.SetOverrideColor(\'' + color + '\', l(\'SugarSightColorOverride' + color + '\').value)">' +
				'</div>';
		}
		return str;
	}
	
	SugarSight.Toggle = function(prefName, button, on, off, invert){
		if(SugarSight.config.soundToggles[prefName]){
			SugarSight.config.soundToggles[prefName] = 0;
		}
		else{
			SugarSight.config.soundToggles[prefName] = 1;
		}
	}
	
	if(CCSE.ConfirmGameVersion(SugarSight.name, SugarSight.version, SugarSight.GameVersion)) Game.registerMod(SugarSight.name, SugarSight); // SugarSight.init();
}

if(!SugarSight.isLoaded){
	if(CCSE && CCSE.isLoaded){
		SugarSight.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(SugarSight.launch);
	}
}
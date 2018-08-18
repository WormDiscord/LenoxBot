exports.run = async client => {
	const Discord = require('discord.js');
	const chalk = require('chalk');

	client.guildconfs.defer.then(() => {
		console.log(chalk.green(client.guildconfs.size + "keys loaded for all discord servers"));
	});
	client.botconfs.defer.then(() => {
		console.log(chalk.green(client.botconfs.size + "keys loaded for all bot configs"));
	});
	client.redeem.defer.then(() => {
		console.log(chalk.green(client.redeem.size + "keys loaded for all redeem keys"));
	});
	client.userdb.defer.then(() => {
		console.log(chalk.green(client.userdb.size + "keys loaded for all user keys"));
	});

	const botconfsdefault = {
		blacklist: [],
		banlist: []
	};

	const botconfs = {
		activity: false,
		activitychannel: '',
		tickets: {},
		ticketid: 0
	};

	const redeemconfs = {
		redeemkey: '',
		redeemed: '',
		redeemkeyowner: ''
	};

	const marketconfs = {
		crate: ['📁', '14', '12', '14', '12'],
		cratekey: ['🔑', '75', '68', '75', '68'],
		pickaxe: ['⛏', '70', '62', '70', '62'],
		joystick: ['🕹', '60', '54', '60', '54'],
		house: ['🏠', '10000', '9000', '10000', '9000'],
		bag: ['👜', '15', '13', '15', '13'],
		diamond: ['💠', '2000', '1800', '2000', '1800'],
		dog: ['🐶', '25', '23', '25', '23'],
		cat: ['🐱', '25', '23', '25', '23'],
		apple: ['🍎', '5', '4', '5', '4'],
		football: ['⚽', '10', '9', '10', '9'],
		car: ['🚙', '6000', '5400', '6000', '5400'],
		phone: ['📱', '400', '360', '400', '360'],
		computer: ['💻', '1000', '900', '1000', '900'],
		camera: ['📷', '600', '540', '600', '540'],
		clock: ['⏰', '15', '13', '15', '13'],
		inventoryslotticket: ['📩', '200', '180', '200', '180'],
		rose: ['🌹', '10', '8', '10', '8'],
		umbrella: ['☂', '30', '27', '30', '27'],
		hamburger: ['🍔', '45', '40', '45', '40'],
		croissant: ['🥐', '9', '8', '9', '8'],
		basketball: ['🏀', '50', '45', '50', '45'],
		watch: ['⌚', '190', '171', '190', '171'],
		projector: ['📽', '623', '560', '623', '560'],
		flashlight: ['🔦', '80', '72', '80', '72'],
		bed: ['🛏', '236', '212', '236', '212'],
		hammer: ['🔨', '50', '45', '50', '45'],
		book: ['📖', '11', '10', '11', '10'],
		mag: ['🔍', '12', '10', '12', '10'],
		banana: ['🍌', '4', '3', '4', '3'],
		tractor: ['🚜', '15000', '13500', '15000', '13500'],
		syringe: ['💉', '132', '119', '132', '119'],
		gun: ['🔫', '674', '608', '674', '608'],
		knife: ['🔪', '87', '78', '87', '78']
	};

	const botconfspremium = {};

	client.user.setPresence({
		game: {
			name: `?help | www.lenoxbot.com`,
			type: 0
		}
	});

	await client.users.filter(u => !client.redeem.has(u.id)).forEach(u => client.redeem.set(u.id, redeemconfs));

	await client.users.filter(u => client.userdb.get(u.id) ? client.userdb.get(u.id).jobstatus === true : undefined).forEach(u => {
		client.users.get(u.id).send('We are very sorry, but we have to tell you that your job has just been canceled due to a bot restart!');
		const userdb = client.userdb.get(u.id);
		userdb.jobstatus = false;
		client.userdb.set(u.id, userdb);
	});

	if (!client.botconfs.has('blackbanlist')) client.botconfs.set('blackbanlist', botconfsdefault);
	if (!client.botconfs.has('botconfs')) client.botconfs.set('botconfs', botconfs);
	await client.botconfs.set('market', marketconfs);
	if (!client.botconfs.has('premium')) client.botconfs.set('premium', botconfspremium);

	client.botconfs.set('botstats', {
		botguildscount: client.guilds.size,
		botmemberscount: client.users.size,
		botcommands: client.botconfs.get('botconfs').commandsexecuted,
		botcommandsincrement: Math.floor(client.botconfs.get('botconfs').commandsexecuted / 170) + 1,
		botmemberscountincrement: Math.floor(client.users.size / 170) + 1,
		botguildscountincrement: Math.floor(client.guilds.size / 170) + 1
	});

	setInterval(() => {
		client.botconfs.set('botstats', {
			botguildscount: client.guilds.size,
			botmemberscount: client.users.size,
			botcommands: client.botconfs.get('botconfs').commandsexecuted,
			botcommandsincrement: Math.floor(client.botconfs.get('botconfs').commandsexecuted / 170) + 1,
			botmemberscountincrement: Math.floor(client.users.size / 170) + 1,
			botguildscountincrement: Math.floor(client.guilds.size / 170) + 1
		});
	}, 1800000);

	const embed = new Discord.RichEmbed()
		.setTitle('Botrestart')
		.setDescription('LenoxBot had a restart and is back again!\nEveryone can now execute commands!')
		.setColor('#99ff66')
		.setAuthor(client.user.tag, client.user.displayAvatarURL);

	if (client.user.id === '354712333853130752') {
		await client.channels.get('413750421341863936').send({
			embed
		});
	}

	if (client.user.id === '354712333853130752') {
		setInterval(() => {
			client.dbl.postStats(client.guilds.size);
		}, 1800000);
	}

	if (Object.keys(client.botconfs.get('botconfs').bans).length !== 0) {
		for (var index in client.botconfs.get('botconfs').bans) {
			var bansconf = client.botconfs.get('botconfs');
			const newBanTime = bansconf.bans[index].banEndDate - Date.now();
			setTimeout(async function () {
				const fetchedbans = await client.guilds.get(bansconf.bans[index].discordserverid).fetchBans();
				const tableload = client.guildconfs.get(bansconf.bans[index].discordserverid);

				if (fetchedbans.has(bansconf.bans[index].memberid)) {
					const user = fetchedbans.get(bansconf.bans[index].memberid);

					await client.guilds.get(bansconf.bans[index].discordserverid).unban(user);

					var lang = require(`../languages/${tableload.language}.json`);
					var unbannedby = lang.unban_unbannedby.replace('%authortag', `${client.user.tag}`);
					var automaticbandescription = lang.temporaryban_automaticbandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id);
					const unmutedembed = new Discord.RichEmbed()
						.setAuthor(unbannedby, client.user.displayAvatarURL)
						.setThumbnail(user.displayAvatarURL)
						.setColor('#FF0000')
						.setTimestamp()
						.setDescription(automaticbandescription);
		
					if (tableload.modlog === 'true') {
						const modlogchannel = client.channels.get(tableload.modlogchannel);
						await modlogchannel.send({
							embed: unmutedembed
						});
					}
				}
				delete bansconf.bans[botconfs.banscount];
				await client.botconfs.set('botconfs', bansconf);
			}, newBanTime);
		}
	}

	if (Object.keys(client.botconfs.get('botconfs').mutes).length !== 0) {
		for (var index in client.botconfs.get('botconfs').mutes) {
			var muteconf = client.botconfs.get('botconfs');
			const newMuteTime = muteconf.mutes[index].muteEndDate - Date.now();
			setTimeout(async function () {
				const membermention = client.guilds.get(muteconf.mutes[index].discordserverid).members.get(muteconf.mutes[index].memberid);
				const role = client.guilds.get(muteconf.mutes[index].discordserverid).roles.get(muteconf.mutes[index].roleid);
				const user = client.users.get(muteconf.mutes[index].memberid);
				const tableload = client.guildconfs.get(muteconf.mutes[index].discordserverid);

				if (membermention.roles.has(tableload.muterole)) {
					await membermention.removeRole(role);

					var lang = require(`../languages/${tableload.language}.json`);
					var unmutedby = lang.unmute_unmutedby.replace('%authortag', `${client.user.tag}`);
					var automaticunmutedescription = lang.unmute_automaticunmutedescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id);
					const unmutedembed = new Discord.RichEmbed()
						.setAuthor(unmutedby, client.user.displayAvatarURL)
						.setThumbnail(user.displayAvatarURL)
						.setColor('#FF0000')
						.setTimestamp()
						.setDescription(automaticunmutedescription);

					if (tableload.modlog === 'true') {
						const modlogchannel = client.channels.get(tableload.modlogchannel);
						modlogchannel.send({
							embed: unmutedembed
						});
					}
				}
				delete muteconf.mutes[muteconf.mutes[index].mutescount];
				await client.botconfs.set('botconfs', muteconf);
			}, newMuteTime);
		}
	}

	setInterval(() => {
		client.guilds.filter(g => client.guilds.has(g.id)).forEach(g => {
			const tableload = client.guildconfs.get(g.id);
			if (tableload.premium) {
				if (client.guildconfs.get(g.id).premium.status === true) {
					if (new Date().getTime() >= Date.parse(tableload.premium.end)) {
						tableload.premium.status = false;
						tableload.premium.bought = [];
						tableload.premium.end = '';
						client.guildconfs.set(g.id, tableload);
					}
				}
			}
		});
	}, 86400000);

	setInterval(() => {
		client.users.filter(g => client.userdb.has(g.id)).forEach(g => {
			const userdb = client.userdb.get(g.id);
			if (userdb.premium) {
				if (client.userdb.get(g.id).premium.status === true) {
					if (new Date().getTime() >= Date.parse(userdb.premium.end)) {
						userdb.premium.status = false;
						userdb.premium.bought = [];
						userdb.premium.end = '';
						client.userdb.set(g.id, userdb);
					}
				}
			}
		});
	}, 86400000);

	console.log(chalk.green(`LENXOBOT: Ready to serve in ${client.channels.size} channels on ${client.guilds.size}, for a total of ${client.users.size} users.`));
};
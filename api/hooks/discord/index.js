const Discord = require('discord.js');
const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
require('dotenv').config();

// Create client collections
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.timezones = new Discord.Collection([
  [1, { name: 'Pacific Time - Los Angeles', zone: 'America/Los_Angeles' }],
  [2, { name: 'Mountain Time - Denver', zone: 'America/Denver' }],
  [3, { name: 'Central Time - Chicago', zone: 'America/Chicago' }],
  [4, { name: 'Eastern Time - New York', zone: 'America/New_York' }],
  [5, { name: 'Atlantic Time - Halifax', zone: 'America/Halifax' }],
  [6, { name: 'Brazil Time - Sao Paulo', zone: 'America/Sao_Paulo' }],
  [7, { name: 'Western Europe - London', zone: 'Europe/London' }],
  [8, { name: 'Central Europe - Berlin', zone: 'Europe/Berlin' }],
  [9, { name: 'Eastern Europe - Bucharest', zone: 'Europe/Bucharest' }],
  [10, { name: 'Russia - Moscow', zone: 'Europe/Moscow' }],
  [11, { name: 'Turkey - Istanbul', zone: 'Europe/Istanbul' }],
  [12, { name: 'India - Kolkata', zone: 'Asia/Kolkata' }],
  [13, { name: 'Bangladesh - Dhaka', zone: 'Asia/Dhaka' }],
  [14, { name: 'Asia - Hong Kong', zone: 'Asia/Hong_Kong' }],
  [15, { name: 'Korea - Seoul', zone: 'Asia/Seoul' }],
  [16, { name: 'Japan - Tokyo', zone: 'Asia/Tokyo' }],
  [17, { name: 'Western Australia - Perth', zone: 'Australia/Perth' }],
  [18, { name: 'Northern Australia - Darwin', zone: 'Australia/Darwin' }],
  [19, { name: 'Eastern Australia - Queensland', zone: 'Australia/Lindeman' }],
  [20, { name: 'Southern Australia - Adelaide', zone: 'Australia/Adelaide' }],
  [21, { name: 'Eastern Australia - Sydney', zone: 'Australia/Sydney' }],
  [22, { name: 'New Zealand - Auckland', zone: 'Pacific/Auckland' }],
]);
client.classes = new Discord.Collection([
  [1, { name: 'Warrior', emoji: '822678044921561099', ref: 0 }],
  [2, { name: 'Warlock', emoji: '822678074931412992', ref: 0 }],
  [3, { name: 'Paladin', emoji: '822678145031208961', ref: 0 }],
  [4, { name: 'Shaman', emoji: '822678092983697438', ref: 0 }],
  [5, { name: 'Rogue', emoji: '822678110948032562', ref: 0 }],
  [6, { name: 'Priest', emoji: '822678131822428180', ref: 0 }],
  [7, { name: 'Mage', emoji: '822678160029777931', ref: 0 }],
  [8, { name: 'Hunter', emoji: '822678175170560060', ref: 0 }],
  [9, { name: 'Druid', emoji: '822678191981461524', ref: 0 }],
  [10, { name: 'Protection_Warrior', emoji: '822678417551130644', ref: 1 }],
  [11, { name: 'Holy_Paladin', emoji: '822678941269229598', ref: 3 }],
  [12, { name: 'Retribution_Paladin', emoji: '822678996399423499', ref: 3 }],
  [13, { name: 'Holy_Priest', emoji: '822678891776311396', ref: 6 }],
  [14, { name: 'Shadow_Priest', emoji: '822678908511453185', ref: 6 }],
  [15, { name: 'Balance_Druid', emoji: '822679201056423946', ref: 9 }],
  [16, { name: 'Feral_Druid', emoji: '822679236854153226', ref: 9 }],
  [17, { name: 'Restoration_Druid', emoji: '822679267434954752', ref: 9 }],
]);
client.intents = new Discord.Collection([
  [1, { name: 'Buyer', emoji: '824908627226787863' }],
  [2, { name: 'Semi_Carry', emoji: '824908594162958348' }],
  [3, { name: 'Hard_Carry', emoji: '824885895810383872' }],
  [4, { name: 'Unknown', emoji: '829990688165986346' }],
]);

// Start processes
(async () => {
  await client.login(process.env.DISCORD_BOT_ID);

  ['commandHandler', 'eventHandler'].forEach((handler) => {
    require(`./handlers/${handler}`)(client, Discord);
  });

  //require('./api')(client, Discord, log);
  //require('./cron')(client, Discord, db, log);
})();

module.exports = (sails) => {
  return {
    client: client,
  };
};

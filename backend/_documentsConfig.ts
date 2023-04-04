/* eslint-disable no-throw-literal */
/* eslint-disable no-shadow */
/* eslint-disable object-shorthand */
// import path from 'path';
import fs from 'fs';
import os from 'os';
import { DBType, DocConfigFile, LogType } from './BE_types';
import logger from './Logging/masterlog';

const home = `${os.homedir()}/Documents/SeeQR`;
const configFile = `config.json`;
const configPath = `${home}/${configFile}`;

const writeConfigDefault = function (): DocConfigFile {
  logger('Could not find config file. Creating default', LogType.WARNING);

  const defaultFile: DocConfigFile = {
    mysql_user: '',
    mysql_pass: '',
    mysql_port: 3306,
    pg_user: '',
    pg_pass: '',
    pg_port: 5432,
    rds_mysql_host: '',
    rds_mysql_user: '',
    rds_mysql_pass: '',
    rds_mysql_port: 3306,
    rds_pg_host: '',
    rds_pg_user: '',
    rds_pg_pass: '',
    rds_pg_port: 5432,
  };

  fs.writeFileSync(configPath, JSON.stringify(defaultFile));

  return defaultFile;
};

const readConfigFile = function (): DocConfigFile {
  if (fs.existsSync(configPath)) {
    try {
      const text = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(text) as DocConfigFile;
    } catch (err: any) {
      throw `Error parsing config file: ${err.message}`;
    }
  } else {
    return writeConfigDefault();
  }
};

interface DocConfig {
  getConfigFolder: () => string;
  getCredentials: (dbType: DBType) => {
    user: string;
    pass?: string;
    password?: string;
    port: number | string;
  };
  getFullConfig: () => Object;
  saveConfig: (config: Object) => void;
}

const docConfig: DocConfig = {
  getConfigFolder: function () {
    if (fs.existsSync(home)) {
      logger(`Found documents directory: ${home}`, LogType.SUCCESS);
    } else {
      logger(
        `Could not find documents directory. Creating at: ${home}`,
        LogType.WARNING
      );
      fs.mkdirSync(home);
    }
    return home;
  },

  getCredentials: function (dbType: DBType) {
    this.getConfigFolder();

    let configFile: DocConfigFile;
    try {
      configFile = readConfigFile();
    } catch (err: any) {
      logger(err.message, LogType.WARNING);
      return { user: 'none', pass: 'none', port: 1 };
    }

    if (dbType === DBType.Postgres) {
      return {
        user: configFile.pg_user,
        pass: configFile.pg_pass,
        port: configFile.pg_port,
      };
    }
    if (dbType === DBType.MySQL) {
      return {
        user: configFile.mysql_user,
        pass: configFile.mysql_pass,
        port: configFile.mysql_port,
      };
    }
    if( dbType === DBType.RDSMySQL) { // added grabbing RDSMySQL credentials
      return {
        host: configFile.rds_mysql_host,
        user: configFile.rds_mysql_user,
        password: configFile.rds_mysql_pass,
        port: configFile.rds_mysql_port,
      };
    }
    if( dbType === DBType.RDSPostgres) { // added grabbing RDSPG credentials
      return {
        host: configFile.rds_pg_host,
        user: configFile.rds_pg_user,
        password: configFile.rds_pg_pass,
        port: configFile.rds_pg_port,
      };
    }

    logger('Could not get credentials of DBType: ', LogType.ERROR, dbType);
    return { user: 'none', pass: 'none', port: 1 };
  },

  getFullConfig: function () {
    this.getConfigFolder();
    let configFile: DocConfigFile;
    try {
      configFile = readConfigFile();
      return configFile;
    } catch (err: any) {
      logger(err.message, LogType.WARNING);
      return {
        mysql_user: 'Failed to retrieve data.',
        mysql_pass: 'Failed to retrieve data.',
        mysql_port: 'Failed to retrieve data.',
        pg_user: 'Failed to retrieve data.',
        pg_pass: 'Failed to retrieve data.',
        pg_port: 'Failed to retrieve data.',
      };
    }
  },

  saveConfig: function (config: Object) {
    try {
      fs.writeFileSync(configPath, JSON.stringify(config));
      logger('Saved new config: ', LogType.NORMAL, config);
    } catch (err: any) {
      logger(err.message, LogType.WARNING);
    }
  },
};

module.exports = docConfig;
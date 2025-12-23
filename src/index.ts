import 'dotenv/config';
import puppeteer from "puppeteer";
import { login } from "./scraper/login";
import chalk from 'chalk';
import inquirer from 'inquirer';
import { debug, info } from './logger';

const menu = async () => {
  debug("Typescript booted");
  const browser = await puppeteer.launch({ headless: false });
  const page    = await browser.newPage();

  await login(page);
  info("Logged in successfully...");
}



menu();

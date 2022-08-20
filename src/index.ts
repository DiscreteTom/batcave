#!/usr/bin/env node

import config from "./config";
import { sync } from "./sync";

Promise.all(config.upload.map(sync));
Promise.all(config.download.map(sync));

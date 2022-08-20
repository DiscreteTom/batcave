#!/usr/bin/env node

import config from "./config";
import { sync } from "./sync";

Promise.all(config.upload.map(pm=>sync(pm.local, pm.remote)));
Promise.all(config.download.map(pm=>sync(pm.remote, pm.local)));

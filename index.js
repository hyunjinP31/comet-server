const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const mysql = require('mysql');
const fs = require('fs');
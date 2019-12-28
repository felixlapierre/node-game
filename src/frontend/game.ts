import { Input } from "./Input";
import {ClientStorage} from './ClientStorage';
import {Socket} from './Socket';
import {Drawing, Html5Canvas} from './Drawing';

const input = new Input();

const clientStorage = new ClientStorage();

const socket = new Socket(input, clientStorage);
socket.setupSockets();

const canvas = document.getElementById("canvas");
const drawing = new Drawing(input, clientStorage, canvas as Html5Canvas);
drawing.StartDrawingLoop();

import { execSync } from 'child_process';

function createNewWindow() {
  execSync('code -n');
}

export default createNewWindow;

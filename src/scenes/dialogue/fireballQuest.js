import Phaser from 'phaser';
import { dialogueHelper } from '../cutscenes/cutscenes';
import quests from '../../quests/quests';

export default class Dialogue extends Phaser.Scene {
  constructor() {
    super('fireballQuest');
    this.questStarted = false;
  }

  playPreDialogue() {
    console.log('setting world');
    const textLines = [
      'Hey, uhhhh...',
      "I'm a little busy right now",
      'You should go talk to that lady over at that other red tent, I think she needed help with something.',
      'But come back and see men when you are done, I may need your help with something.',
    ];

    const nameTextLines = Array(textLines.length).fill('Alpha');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  playDialogue() {
    const textLines = [
      '...',
      'Why are you looking at me like that?',
      "Don't get any ideas OK, im not a real wolf",
      'Let me introduce myself, I am the pack leader of the wolves',
      'You may call me Alpha',
      'Dont\t go spreading this around but...',
      "I've been training with the wolves for a while now.",
      'I plan on leading a revolution against the Bots with the wolves by my side.',
      'There is one problem though.',
      'You see, there is this one wolf who is way bigger than the rest.',
      'I think it plans on taking my pack from me and taking over as the new Alpha.',
      'I cant have this happen as it would ruin all my plans.',
      'Now, I would fight the wolf myself but I uh....',
      "Well, I don't have the kind of gear you have so I thought it best if you fight in my stead.",
      'If you do this for me, I can make it worth your while.',
      "My pack always brings me back 'gifts' when they go hunting",
      'I may have something that might interest you...',
      "Just let me know when the deed is done and you'll be rewarded generously.",
      'You can find the wolf running around on the coast, SouthWest of here.',
      'Remember its the wolf that is bigger than the others.',
    ];

    const nameTextLines = Array(textLines.length).fill('Alpha');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  playIncomplete() {
    const textLines = [
      'Were you able to put that Big Bad Wolf to rest?',
      "Come back and see me when you do, I've got something for you.",
    ];

    const nameTextLines = Array(textLines.length).fill('Alpha');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  playQuestOver() {
    const textLines = [
      "You're back?!!?",
      "I mean....I'm not surprised, I knew you would succeed.",
      'You dont know how much this means to me, and all of humanity for that matter.',
      'My pack and I shall rise against the Bots and reclaim our lands.',
      "You shall go down in history as the one who served the 'Great Alpha Leader'",
      'Here, take this...',
      "I have no use for this but I'm sure you can put it to good use.",
    ];

    const nameTextLines = Array(textLines.length).fill('Alpha');

    dialogueHelper.call(this, textLines, nameTextLines);
  }

  endScene() {
    // if (!quests[this.npc.name].isStarted) {
    //   console.log('getting scene');
    //   this.world = this.scene.get('RobotCityScene');
    //   console.log(this.world);
    //   // this.world.events.emit('startQuest');
    //   console.log(this.world);

    //   this.endCutScene();
    //   this.world = this.scene.get('RobotCityScene');
    // } else if (
    if (quests[this.npc.name].isStarted && !quests[this.npc.name].isCompleted) {
      console.log('quest started and not completed');

      this.endCutScene();
    } else {
      this.endCutScene();
    }
  }

  endCutScene() {
    this.scene.get('RobotCityScene').events.emit('cutSceneEnd');
    this.scene.stop();
  }

  create({ player, npc, data }) {
    this.player = player;
    this.npc = npc;

    if (data.killed) {
      this.killed = data.killed;
    }

    this.cursors = this.input.keyboard.addKeys({
      cont: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    if (player.inventory.gunAttachment === 0 && this.questStarted === false) {
      this.playPreDialogue();
    } else if (
      !quests[npc.name].isStarted &&
      player.inventory.gunAttachment === 1 &&
      this.questStarted === false
    ) {
      this.world = this.scene.get('RobotCityScene');
      // this.world.events.emit('startQuest');
      this.playDialogue();

      this.questStarted = true;

      console.log('mission started');
      console.log(this.world);
      if (this.world) {
        console.log('send in wolves');
        this.world.sendInWolves = true;
      }
      this.world.events.emit('startQuest');
    } else if (!quests[npc.name].isCompleted && this.questStarted) {
      this.playIncomplete();
    } else if (quests[npc.name].isStarted && quests[npc.name].isCompleted) {
      this.playQuestOver();
    }
  }
}

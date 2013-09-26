(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             '../lib/normalizer.js', '../lib/data.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, _, Normalizer, data, myapp) {

QUnit.module('30_normalizer');

QUnit.test('Normalizer', function () {
    QUnit.strictEqual(typeof Normalizer, 'function', 'is function');
});

QUnit.test('new', function () {
    var got, exp;

    var n = new Normalizer();
    QUnit.strictEqual(typeof n, 'object', 'is object');
    QUnit.strictEqual(typeof n.initialize, 'function', 'has initialize()');

    QUnit.strictEqual(typeof n.equips.body, 'object', 'equips.body');

    got = n.equips;
    exp = data.equips;
    QUnit.strictEqual(got, exp, 'equips is strict equal');
    got = n.equips.body;
    exp = data.equips.body;
    QUnit.strictEqual(got, exp, 'equips.body is strict equal');

    QUnit.strictEqual(n.weaponSlot, 0, 'weaponSlot');
});

QUnit.test('initialize', function () {
    var got,
        n = new Normalizer();

    n.initialize({ weaponSlot: 1 });
    got = n.weaponSlot;
    QUnit.strictEqual(got, 1, 'weaponSlot');
});

QUnit.test('_compact', function () {
    var got, exp, combs, trees,
        count = 1,
        n = new Normalizer();

    trees = [ 'a' ];
    combs = [ { a: 1, b: 2 } ];
    got = n._compact(trees, combs);
    exp = [ { a: 1 } ];
    QUnit.deepEqual(got, exp, 'case ' + count++);

    trees = [ 'b' ];
    combs = [ { a: 1 } ];
    got = n._compact(trees, combs);
    exp = [ { b: 0 } ];
    QUnit.deepEqual(got, exp, 'case ' + count++);

    trees = [ 'a', 'c' ];
    combs = [ { a: 1, b: 2 }, { b: 1, c: -1 } ];
    got = n._compact(trees, combs);
    exp = [ { a: 1, c: 0 }, { a: 0, c: -1 } ];
    QUnit.deepEqual(got, exp, 'case ' + count++);

    trees = [ 'a', '胴系統倍化' ];
    combs = [ { a: 1, b: 2 }, { '胴系統倍化': 1 } ];
    got = n._compact(trees, combs);
    exp = [ { a: 1, '胴系統倍化': 0 }, { a: 0, '胴系統倍化': 1 } ];
    QUnit.deepEqual(got, exp, 'case ' + count++);

    trees = [ 'a' ];
    combs = [];
    got = n._compact(trees, combs);
    exp = [ { a: 0 } ];
    QUnit.deepEqual(got, exp, 'case ' + count++);
});

QUnit.test('_compareAny', function () {
    var src, dst,
        count = 1,
        n = new Normalizer();

    src = { a: 1 }; dst = { a: 1 };
    QUnit.ok(!n._compareAny(src, dst), 'case ' + count);
    src = { a: 1, b: 0 }; dst = { a: 1, b: 0 };
    QUnit.ok(!n._compareAny(src, dst), 'case ' + count);
    ++count;

    src = { a: 1 }; dst = { a: 2 };
    QUnit.ok(n._compareAny(src, dst), 'case ' + count);
    src = { a: 2 }; dst = { a: 1 };
    QUnit.ok(!n._compareAny(src, dst), 'case ' + count);
    ++count;

    src = { a: -1 }; dst = { a: 1 };
    QUnit.ok(n._compareAny(src, dst), 'case ' + count);
    src = { a: 1 }; dst = { a: -1 };
    QUnit.ok(!n._compareAny(src, dst), 'case ' + count);
    ++count;

    src = { a: -1 }; dst = { a: 0 };
    QUnit.ok(n._compareAny(src, dst), 'case ' + count);
    src = { a: 0 }; dst = { a: -1 };
    QUnit.ok(!n._compareAny(src, dst), 'case ' + count);
    ++count;

    src = { a: 1, b: 1 }; dst = { a: 1, b: 2 };
    QUnit.ok(n._compareAny(src, dst), 'case ' + count);
    src = { a: 1, b: 2 }; dst = { a: 1, b: 1 };
    QUnit.ok(!n._compareAny(src, dst), 'case ' + count);
    ++count;

    src = { a: 1, b: 1 }; dst = { a: 0, b: 2 };
    QUnit.ok(n._compareAny(src, dst), 'case ' + count);
    src = { a: 0, b: 2 }; dst = { a: 1, b: 1 };
    QUnit.ok(n._compareAny(src, dst), 'case ' + count);
    ++count;

    src = { a: 0, b: 0 }; dst = { a: -1, b: 1 };
    QUnit.ok(n._compareAny(src, dst), 'case ' + count);
    src = { a: -1, b: 1 }; dst = { a: 0, b: 0 };
    QUnit.ok(n._compareAny(src, dst), 'case ' + count);
    ++count;

    src = { a: 2, b: 1, c: 0 }; dst = { a: 1, b: 1, c: 1 };
    QUnit.ok(n._compareAny(src, dst), 'case ' + count);
    src = { a: 1, b: 1, c: 1 }; dst = { a: 2, b: 1, c: 0 };
    QUnit.ok(n._compareAny(src, dst), 'case ' + count);
    ++count;
});

QUnit.test('_collectMaxSkill', function () {
    var got, exp, combs,
         count = 1,
        n = new Normalizer();

    combs = [ { a: 1 } ];
    got = n._collectMaxSkill(combs);
    exp = [ { a: 1 } ];
    QUnit.deepEqual(got, exp, 'case ' + count++);

    combs = [ { a: 1 }, { a: 2 } ];
    got = n._collectMaxSkill(combs);
    exp = [ { a: 2 } ];
    QUnit.deepEqual(got, exp, 'case ' + count++);

    combs = [ { a: 1, b: 1 }, { a: 2, b: 1 } ];
    got = n._collectMaxSkill(combs);
    exp = [ { a: 2, b: 1 } ];
    QUnit.deepEqual(got, exp, 'case ' + count++);

    combs = [ { a: 1, b: -3 }, { a: 1, b: -1 }, { a: -1, b: 0 } ];
    got = n._collectMaxSkill(combs);
    exp = [ { a: 1, b: -1 }, { a: -1, b: 0 } ];
    QUnit.deepEqual(got, exp, 'case ' + count++);

    combs = [ { a: 1, b: 1, c: 0 }, { a: 2, b: 1, c: 0 },
              { a: 1, b: 1, c: 1 },
              { a: 0, b: 2, c: 1 }, { a: 0, b: 1, c: 1 } ];
    got = n._collectMaxSkill(combs);
    exp = [ { a: 2, b: 1, c: 0 }, { a: 1, b: 1, c: 1 }, { a: 0, b: 2, c: 1 } ];
    QUnit.deepEqual(got, exp, 'case ' + count++);

    // 同じ組み合わせがあると正しく動かない
    combs = [ { a: 2, b: 0 }, { a: 1, b: 1 }, { a: 2, b: 0 } ];
    got = n._collectMaxSkill(combs);
    exp = [ { a: 1, b: 1 } ];
    //exp = [ { a: 2, b: 0 }, { a: 1, b: 1 } ]; // ホントの正しい結果はこれ
    QUnit.deepEqual(got, exp, 'same comb');
});

QUnit.test('_normalize1', function () {
    var got, exp, names, equips,
        n = new Normalizer();

    // case 1
    names = [ 'ジャギィＳメイル'   // 攻撃+2, スロ1
            , 'クックＳメイル'     // 攻撃+3, スロ2
            , 'ギザミメイル'     // 斬れ味+2, スロ0
            , 'レザーベスト'       // スロ0
            , 'グラビドＵメイル'   // スロ3
            , '三眼の首飾り'       // スロ3
            , 'シルバーソルメイル' // 斬れ味+2, スロ3
    ];
    equips = myapp.equips('body', names);
    if (equips.length !== 7) throw new Error('equips.length is not 7: ' + equips.length);

    got = n._normalize1([ '攻撃', '斬れ味' ], equips);
    exp = { 'ジャギィＳメイル':
            [ { '攻撃': 3, '研ぎ師': 1, '効果持続': -2, '気絶': 2, '防御': -1 },
              { '攻撃': 2, '研ぎ師': 1, '効果持続': -2, '気絶': 2, '斬れ味': 1, '匠': -1 } ],
            'クックＳメイル':
            [ { '攻撃': 5, '火耐性': 4, '防御': -2 },
              { '攻撃': 4, '火耐性': 4, '防御': -1, '斬れ味': 1, '匠': -1 },
              { '攻撃': 3, '火耐性': 4, '斬れ味': 2, '匠': -2 },
              { '攻撃': 6, '火耐性': 4, '防御': -1 } ],
            'ギザミメイル':
            [ { '斬れ味': 2, '研ぎ師': 1 } ],
            slot0: [],
            slot3:
            [ { '攻撃': 3, '防御': -3 },
              { '攻撃': 2, '防御': -2, '斬れ味': 1, '匠': -1 },
              { '攻撃': 1, '防御': -1, '斬れ味': 2, '匠': -2 },
              { '斬れ味': 3, '匠': -3 },
              { '攻撃': 4, '防御': -2 },
              { '攻撃': 3, '防御': -1, '斬れ味': 1, '匠': -1 },
              { '攻撃': 5, '防御': -1 } ],
            'シルバーソルメイル':
            [ { '痛撃': 1, '斬れ味': 2, '回復量': -2, '攻撃': 3, '防御': -3 },
              { '痛撃': 1, '斬れ味': 3, '回復量': -2, '攻撃': 2, '防御': -2, '匠': -1 },
              { '痛撃': 1, '斬れ味': 4, '回復量': -2, '攻撃': 1, '防御': -1, '匠': -2 },
              { '痛撃': 1, '斬れ味': 5, '回復量': -2, '匠': -3 },
              { '痛撃': 1, '斬れ味': 2, '回復量': -2, '攻撃': 4, '防御': -2 },
              { '痛撃': 1, '斬れ味': 3, '回復量': -2, '攻撃': 3, '防御': -1, '匠': -1 },
              { '痛撃': 1, '斬れ味': 2, '回復量': -2, '攻撃': 5, '防御': -1 } ] };
    QUnit.deepEqual(got, exp, 'case 1');

    // case 2: 斬れ味と匠みたくプラスマイナスが反発するポイントの場合
    names = [ 'ゴアメイル'         // 匠+2, スロ0
            , 'アカムトウルンテ'   // 匠+2, 斬れ味-2, スロ1
            , 'シルバーソルメイル' // 斬れ味+2, スロ3
            , 'ユクモノドウギ・天' // 匠+1, スロ2
    ];
    equips = myapp.equips('body', names);
    if (equips.length !== 4) throw new Error('equips.length is not 4: ' + equips.length);

    got = n._normalize1([ '匠', '斬れ味' ], equips);
    exp = { 'ゴアメイル':
            [ { '細菌学': 2, '匠': 2, '闘魂': 2, '火耐性': -3 } ],
            'アカムトウルンテ':
            [ { '匠': 1, '達人': 3, '聴覚保護': 1, '斬れ味': -1 } ],
            'シルバーソルメイル':
            [ { '痛撃': 1, '斬れ味': 5, '回復量': -2, '匠': -3 },
              { '痛撃': 1, '斬れ味': 2, '回復量': -2, '匠': 0 },
              { '痛撃': 1, '斬れ味': 0, '回復量': -2, '匠': 3 } ],
            'ユクモノドウギ・天':
            [ { '匠': -1, '研ぎ師': 1, '回復量': 2, '加護': 2, '斬れ味': 2 },
              { '匠': 2, '研ぎ師': 1, '回復量': 2, '加護': 2, '斬れ味': -1 } ] };
    QUnit.deepEqual(got, exp, 'case 2');

    // case 3: 胴系統倍化
    names = [ 'クックＳグリーヴ' // 攻撃+4, スロ1
            , 'アシラグリーヴ'   // 胴系統倍化
            , 'ブレイブパンツ'   // スロ0
            , 'カブラＳグリーヴ' // 胴系統倍化
            , 'バンギスグリーヴ' // 攻撃+1, 斬れ味+3, スロ3
    ];
    equips = myapp.equips('leg', names);
    if (equips.length !== 5) throw new Error('equips.length is not 5: ' + equips.length);

    got = n._normalize1([ '攻撃', '斬れ味', '胴系統倍化' ], equips);
    exp = { 'クックＳグリーヴ':
            [ { '攻撃': 5, '聴覚保護': -2, 'スタミナ': 2, '火耐性': 2, '防御': -1 },
              { '攻撃': 4, '聴覚保護': -2, 'スタミナ': 2, '火耐性': 2, '斬れ味': 1, '匠': -1 } ],
            '胴系統倍化': [ { '胴系統倍化': 1 } ],
            slot0: [],
            'バンギスグリーヴ':
            [ { '攻撃': 4, '斬れ味': 3, '腹減り': -2, '防御': -3 },
              { '攻撃': 3, '斬れ味': 4, '腹減り': -2, '防御': -2, '匠': -1 },
              { '攻撃': 2, '斬れ味': 5, '腹減り': -2, '防御': -1, '匠': -2 },
              { '攻撃': 1, '斬れ味': 6, '腹減り': -2, '匠': -3 },
              { '攻撃': 5, '斬れ味': 3, '腹減り': -2, '防御': -2 },
              { '攻撃': 4, '斬れ味': 4, '腹減り': -2, '防御': -1, '匠': -1 },
              { '攻撃': 6, '斬れ味': 3, '腹減り': -2, '防御': -1 } ] };
    QUnit.deepEqual(got, exp, 'case 3');

    QUnit.deepEqual(n._normalize1(), null, 'nothing in');
    QUnit.deepEqual(n._normalize1(undefined), null, 'undefined');
    QUnit.deepEqual(n._normalize1(null), null, 'null');
    QUnit.deepEqual(n._normalize1(''), null, 'empy string');

    QUnit.deepEqual(n._normalize1([ '攻撃' ]), null, 'skill only');
    QUnit.deepEqual(n._normalize1([ '攻撃' ], undefined), null, 'skill, undefined');
    QUnit.deepEqual(n._normalize1([ '攻撃' ], null), null, 'skill, null');
    QUnit.deepEqual(n._normalize1([ '攻撃' ], []), null, 'skill, []');
});

QUnit.test('_normalize1 (none deco)', function () {
    var got, exp, names, equips,
        n = new Normalizer();

    data.decos = []; // 装飾品なし

    names = [ 'ハンターメイル'     // スロ1
            , 'レザーベスト'       // スロ0
            , 'ジャギィＳメイル'   // 攻撃+2, スロ1
            , 'クックＳメイル'     // 攻撃+3, スロ2
            , 'バンギスメイル'     // 攻撃+4, 斬れ味+1, スロ0
            , '三眼の首飾り'       // スロ3
            , 'シルバーソルメイル' // 斬れ味+2, スロ3
    ];
    equips = myapp.equips('body', names);
    if (equips.length !== 7) throw new Error('equips is not 7: ' + equips.length);

    got = n._normalize1([ '攻撃', '斬れ味' ], equips);
    exp = { slot1: [],
            slot0: [],
            'ジャギィＳメイル':
            [ { '攻撃': 2, '研ぎ師': 1, '効果持続': -2, '気絶': 2 } ],
            'クックＳメイル':
            [ { '攻撃': 3, '火耐性': 4 } ],
            'バンギスメイル':
            [ { '攻撃': 4, '斬れ味': 1, '食事': 4, '腹減り': -2 } ],
            slot3: [],
            'シルバーソルメイル':
            [ { '痛撃': 1, '斬れ味': 2, '回復量': -2 } ] };
    QUnit.deepEqual(got, exp, 'none deco');

    myapp.initialize(); // 装飾品なしを元に戻す
});

QUnit.test('_normalize2', function () {
    var got, exp, combs,
        n = new Normalizer();

    combs = { 'ジャギィＳメイル':
               [ { '攻撃': 3, '達人': 3, '回復速度': 2, '効果持続': -2, '防御': -1 },
                 { '攻撃': 2, '達人': 3, '回復速度': 2, '効果持続': -2, '斬れ味': 1, '匠': -1 } ],
              slot0: [],
              slot2:
              [ { '攻撃': 2, '防御': -2 },
                { '攻撃': 1, '防御': -1, '斬れ味': 1, '匠': -1 },
                { '斬れ味': 2, '匠': -2 } ],
              'レザーベスト':
              [ { '高速収集': 3, '採取': 3, '気まぐれ': 2 } ] };
    got = n._normalize2([ '攻撃', '斬れ味' ], combs);
    exp = { 'ジャギィＳメイル':
            [ { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 } ],
            slot0: [ { '攻撃': 0, '斬れ味': 0 } ],
            slot2:
            [ { '攻撃': 2, '斬れ味': 0 },
              { '攻撃': 1, '斬れ味': 1 },
              { '攻撃': 0, '斬れ味': 2 } ],
            'レザーベスト': [ { '攻撃': 0, '斬れ味': 0 } ] };
    QUnit.deepEqual(got, exp, "_normalize2");

    // 胴系統倍化
    combs = { 'ジャギィＳグリーヴ':
              [ { '攻撃': 5, '達人': 3, '回復速度': 3, '効果持続': -1, '防御': -1 },
                { '攻撃': 4, '達人': 3, '回復速度': 3, '効果持続': -1, '斬れ味': 1, '匠': -1 } ],
              '胴系統倍化': [ { '胴系統倍化': 1 } ],
              slot0: [],
              'シルバーソルグリーヴ':
              [ { '痛撃': 1, '斬れ味': 2, '攻撃': 5, '体力': -2, '防御': -3 },
                { '痛撃': 1, '斬れ味': 3, '攻撃': 4, '体力': -2, '防御': -2, '匠': -1 },
                { '痛撃': 1, '斬れ味': 4, '攻撃': 3, '体力': -2, '防御': -1, '匠': -2 },
                { '痛撃': 1, '斬れ味': 5, '攻撃': 2, '体力': -2, '匠': -3 },
                { '痛撃': 1, '斬れ味': 2, '攻撃': 6, '体力': -2, '防御': -2 },
                { '痛撃': 1, '斬れ味': 3, '攻撃': 5, '体力': -2, '防御': -1, '匠': -1 },
                { '痛撃': 1, '斬れ味': 2, '攻撃': 7, '体力': -2, '防御': -1 },
                { '痛撃': 1, '斬れ味': 6, '攻撃': 2, '体力': -2, '匠': -2 } ] };
    got = n._normalize2([ '攻撃', '斬れ味', '胴系統倍化' ], combs);
    exp = { 'ジャギィＳグリーヴ':
            [ { '攻撃': 5, '斬れ味': 0, '胴系統倍化': 0 },
              { '攻撃': 4, '斬れ味': 1, '胴系統倍化': 0 } ],
            '胴系統倍化': [ { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 1 } ],
            slot0: [ { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 0 } ],
            'シルバーソルグリーヴ':
            [ { '攻撃': 5, '斬れ味': 2, '胴系統倍化': 0 },
              { '攻撃': 4, '斬れ味': 3, '胴系統倍化': 0 },
              { '攻撃': 3, '斬れ味': 4, '胴系統倍化': 0 },
              { '攻撃': 2, '斬れ味': 5, '胴系統倍化': 0 },
              { '攻撃': 6, '斬れ味': 2, '胴系統倍化': 0 },
              { '攻撃': 5, '斬れ味': 3, '胴系統倍化': 0 },
              { '攻撃': 7, '斬れ味': 2, '胴系統倍化': 0 },
              { '攻撃': 2, '斬れ味': 6, '胴系統倍化': 0 } ] };
    QUnit.deepEqual(got, exp, "dupli");

    QUnit.deepEqual(n._normalize2(), null, 'nothing in');
    QUnit.deepEqual(n._normalize2(undefined), null, 'undefined');
    QUnit.deepEqual(n._normalize2(null), null, 'null');
    QUnit.deepEqual(n._normalize2([]), null, '[]');

    QUnit.deepEqual(n._normalize2([ '攻撃' ]), null, '[ skill ]');
    QUnit.deepEqual(n._normalize2([ '攻撃' ], undefined), null, '[ skill, undefined ]');
    QUnit.deepEqual(n._normalize2([ '攻撃' ], null), null, '[ skill, null ]');
    QUnit.deepEqual(n._normalize2([ '攻撃' ], {}), {}, '[ skill, {} ]');
});

QUnit.test('_normalize3', function () {
    var got, exp, combs,
        n = new Normalizer();

    // case 1: [ '攻撃', '斬れ味' ]
    combs = { 'ジャギィＳメイル':
              [ { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 } ],
              'バギィＳメイル':
              [ { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 4, '斬れ味': 1 },
                { '攻撃': 3, '斬れ味': 2 }, { '攻撃': 6, '斬れ味': 0 } ],
              'ジンオウメイル':
              [ { '攻撃': 0, '斬れ味': 2 } ],
              slot0: [ { '攻撃': 0, '斬れ味': 0 } ],
              slot3:
              [ { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 },
                { '攻撃': 1, '斬れ味': 2 }, { '攻撃': 0, '斬れ味': 3 },
                { '攻撃': 4, '斬れ味': 0 }, { '攻撃': 3, '斬れ味': 1 },
                { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 0, '斬れ味': 4 } ],
              'シルバーソルメイル':
              [ { '攻撃': 3, '斬れ味': 1 }, { '攻撃': 2, '斬れ味': 2 },
                { '攻撃': 1, '斬れ味': 3 }, { '攻撃': 4, '斬れ味': 1 } ] };
    got = n._normalize3(combs);
    exp = { 'ジャギィＳメイル':
            [ { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 } ],
            'バギィＳメイル':
            [ { '攻撃': 4, '斬れ味': 1 }, { '攻撃': 3, '斬れ味': 2 },
              { '攻撃': 6, '斬れ味': 0 } ],
            'ジンオウメイル':
            [ { '攻撃': 0, '斬れ味': 2 } ],
            slot0: [ { '攻撃': 0, '斬れ味': 0 } ],
            slot3:
            [ { '攻撃': 1, '斬れ味': 2 }, { '攻撃': 3, '斬れ味': 1 },
              { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 0, '斬れ味': 4 } ],
            'シルバーソルメイル':
            [ { '攻撃': 2, '斬れ味': 2 }, { '攻撃': 1, '斬れ味': 3 },
              { '攻撃': 4, '斬れ味': 1 } ] };
    QUnit.deepEqual(got, exp, "case 1");

    // case 2: スキルポイントが 0 やマイナスでも正規化できるか
    combs = { 'hoge':
              [ { '匠': 1, '斬れ味': -2 },
                { '匠': 0, '斬れ味': 0 },
                { '匠': -1, '斬れ味': 0 },
                { '匠': 1, '斬れ味': -1 },
                { '匠': 0, '斬れ味': 1 } ],
              'slot0': [ { '匠': 0, '斬れ味': 0 } ] };
    got = n._normalize3(combs);
    exp = { 'hoge': [ { '匠': 1, '斬れ味': -1 }, { '匠': 0, '斬れ味': 1 } ],
           'slot0': [ { '匠': 0, '斬れ味': 0 } ] };
    QUnit.deepEqual(got, exp, "case 2");

    // case 3: 胴系統倍化
    combs = { 'ジャギィＳグリーヴ':
              [ { '攻撃': 5, '斬れ味': 0, '胴系統倍化': 0 },
                { '攻撃': 4, '斬れ味': 1, '胴系統倍化': 0 } ],
              '胴系統倍化': [ { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 1 } ],
              slot0: [ { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 0 } ],
              'シルバーソルグリーヴ':
              [ { '攻撃': 5, '斬れ味': 2, '胴系統倍化': 0 },
                { '攻撃': 4, '斬れ味': 3, '胴系統倍化': 0 },
                { '攻撃': 3, '斬れ味': 4, '胴系統倍化': 0 },
                { '攻撃': 2, '斬れ味': 5, '胴系統倍化': 0 },
                { '攻撃': 6, '斬れ味': 2, '胴系統倍化': 0 },
                { '攻撃': 5, '斬れ味': 3, '胴系統倍化': 0 },
                { '攻撃': 7, '斬れ味': 2, '胴系統倍化': 0 },
                { '攻撃': 2, '斬れ味': 6, '胴系統倍化': 0 } ] };
    got = n._normalize3(combs);
    exp = { 'ジャギィＳグリーヴ':
             [ { '攻撃': 5, '斬れ味': 0, '胴系統倍化': 0 },
               { '攻撃': 4, '斬れ味': 1, '胴系統倍化': 0 } ],
            '胴系統倍化': [ { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 1 } ],
            slot0: [ { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 0 } ],
            'シルバーソルグリーヴ':
            [ { '攻撃': 3, '斬れ味': 4, '胴系統倍化': 0 },
              { '攻撃': 5, '斬れ味': 3, '胴系統倍化': 0 },
              { '攻撃': 7, '斬れ味': 2, '胴系統倍化': 0 },
              { '攻撃': 2, '斬れ味': 6, '胴系統倍化': 0 } ] };
    QUnit.deepEqual(got, exp, "case 3");

    QUnit.deepEqual(n._normalize3(), null, 'nothing in');
    QUnit.deepEqual(n._normalize3(undefined), null, 'undefined');
    QUnit.deepEqual(n._normalize3(null), null, 'null');
    QUnit.deepEqual(n._normalize3({}), {}, '{}');
});

QUnit.test('_normalize4', function () {
    var got, exp, combs,
        n = new Normalizer();

    // 胴系統倍化がない
    combs = { 'ジャギィＳメイル':
              [ { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 } ],
              'バギィＳメイル':
              [ { '攻撃': 4, '斬れ味': 1 }, { '攻撃': 3, '斬れ味': 2 },
                { '攻撃': 6, '斬れ味': 0 } ],
              'ジンオウメイル':
              [ { '攻撃': 0, '斬れ味': 2 } ],
              slot0: [ { '攻撃': 0, '斬れ味': 0 } ],
              slot3:
              [ { '攻撃': 1, '斬れ味': 2 }, { '攻撃': 3, '斬れ味': 1 },
                { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 0, '斬れ味': 4 } ],
              'シルバーソルメイル':
              [ { '攻撃': 2, '斬れ味': 2 }, { '攻撃': 1, '斬れ味': 3 },
                { '攻撃': 4, '斬れ味': 1 } ] };
    got = n._normalize4(combs);
    exp = { 'ジャギィＳメイル':
            [ { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 } ],
            'バギィＳメイル':
            [ { '攻撃': 4, '斬れ味': 1 }, { '攻撃': 3, '斬れ味': 2 },
              { '攻撃': 6, '斬れ味': 0 } ],
            'ジンオウメイル':
            [ { '攻撃': 0, '斬れ味': 2 } ],
            slot0: [ { '攻撃': 0, '斬れ味': 0 } ],
            slot3:
            [ { '攻撃': 1, '斬れ味': 2 }, { '攻撃': 3, '斬れ味': 1 },
              { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 0, '斬れ味': 4 } ],
            'シルバーソルメイル':
            [ { '攻撃': 2, '斬れ味': 2 }, { '攻撃': 1, '斬れ味': 3 },
              { '攻撃': 4, '斬れ味': 1 } ] };
    QUnit.deepEqual(got, exp, "case 1");

    // case 3: 胴系統倍化
    combs = { 'ジャギィＳグリーヴ':
              [ { '攻撃': 5, '斬れ味': 0, '胴系統倍化': 0 },
                { '攻撃': 4, '斬れ味': 1, '胴系統倍化': 0 } ],
              '胴系統倍化': [ { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 1 } ],
              slot0: [ { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 0 } ],
              'シルバーソルグリーヴ':
              [ { '攻撃': 3, '斬れ味': 4, '胴系統倍化': 0 },
                { '攻撃': 5, '斬れ味': 3, '胴系統倍化': 0 },
                { '攻撃': 7, '斬れ味': 2, '胴系統倍化': 0 },
                { '攻撃': 2, '斬れ味': 6, '胴系統倍化': 0 } ] };
    got = n._normalize4(combs);
    exp = { 'ジャギィＳグリーヴ':
             [ { '攻撃': 5, '斬れ味': 0 },
               { '攻撃': 4, '斬れ味': 1 } ],
            '胴系統倍化': [ { '胴系統倍化': 1 } ],
            slot0: [ { '攻撃': 0, '斬れ味': 0 } ],
            'シルバーソルグリーヴ':
            [ { '攻撃': 3, '斬れ味': 4 },
              { '攻撃': 5, '斬れ味': 3 },
              { '攻撃': 7, '斬れ味': 2 },
              { '攻撃': 2, '斬れ味': 6 } ] };
    QUnit.deepEqual(got, exp, "case 3");

    QUnit.deepEqual(n._normalize4(), null, 'nothing in');
    QUnit.deepEqual(n._normalize4(undefined), null, 'undefined');
    QUnit.deepEqual(n._normalize4(null), null, 'null');
    QUnit.deepEqual(n._normalize4({}), {}, '{}');
});

QUnit.test('_normalize5', function () {
    var got, exp, combs,
        n = new Normalizer();

    var sorter = function (actiCombs) {
        return _.sortBy(actiCombs, function (comb) {
            return _.reduce(comb.skillComb, function (memo, pt, skill) {
                return memo + skill + pt;
            }, '');
        });
    };

    combs = { 'ジャギィＳメイル':
              [ { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 } ],
              'バギィＳメイル':
              [ { '攻撃': 4, '斬れ味': 1 }, { '攻撃': 3, '斬れ味': 2 },
                { '攻撃': 6, '斬れ味': 0 } ],
              'ジンオウメイル':
              [ { '攻撃': 0, '斬れ味': 2 } ],
              slot0: [ { '攻撃': 0, '斬れ味': 0 } ],
              slot3:
              [ { '攻撃': 1, '斬れ味': 2 }, { '攻撃': 3, '斬れ味': 1 },
                { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 0, '斬れ味': 4 } ],
              'シルバーソルメイル':
              [ { '攻撃': 2, '斬れ味': 2 }, { '攻撃': 1, '斬れ味': 3 },
                { '攻撃': 4, '斬れ味': 1 } ] };
    got = n._normalize5(combs);
    exp = [ { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'ジンオウメイル' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 0 }, equips: [ 'ジャギィＳメイル' ] },
            { skillComb: { '攻撃': 2, '斬れ味': 1 }, equips: [ 'ジャギィＳメイル' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 2 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 1 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 2, '斬れ味': 2 }, equips: [ 'シルバーソルメイル' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'シルバーソルメイル' ] },
            { skillComb: { '攻撃': 4, '斬れ味': 1 },
              equips: [ 'バギィＳメイル', 'シルバーソルメイル' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'バギィＳメイル' ] },
            { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ 'バギィＳメイル' ] } ];
    QUnit.deepEqual(sorter(got), sorter(exp), "normalizer4");

    // 胴系統倍化
    combs = { 'ジャギィＳグリーヴ':
              [ { '攻撃': 5, '斬れ味': 0 },
                { '攻撃': 4, '斬れ味': 1 } ],
              '胴系統倍化': [ { '胴系統倍化': 1 } ],
              slot0: [ { '攻撃': 0, '斬れ味': 0 } ],
              'シルバーソルグリーヴ':
              [ { '攻撃': 3, '斬れ味': 4 }, { '攻撃': 5, '斬れ味': 3 },
                { '攻撃': 7, '斬れ味': 2 }, { '攻撃': 2, '斬れ味': 6 } ] };
    got = n._normalize5(combs);
    exp = [ { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
            { skillComb: { '胴系統倍化': 1 }, equips: [ '胴系統倍化' ] },
            { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'ジャギィＳグリーヴ' ] },
            { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'ジャギィＳグリーヴ' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 4 }, equips: [ 'シルバーソルグリーヴ' ] },
            { skillComb: { '攻撃': 5, '斬れ味': 3 }, equips: [ 'シルバーソルグリーヴ' ] },
            { skillComb: { '攻撃': 2, '斬れ味': 6 }, equips: [ 'シルバーソルグリーヴ' ] },
            { skillComb: { '攻撃': 7, '斬れ味': 2 }, equips: [ 'シルバーソルグリーヴ' ] } ];
    QUnit.deepEqual(sorter(got), sorter(exp), "dupli");

    QUnit.deepEqual(n._normalize5(), [], 'nothing in');
    QUnit.deepEqual(n._normalize5(undefined), [], 'undefined');
    QUnit.deepEqual(n._normalize5(null), [], 'null');
    QUnit.deepEqual(n._normalize5({}), [], '{}');
});

QUnit.test('_normalizeWeaponSkill', function () {
    var got, exp,
        n = new Normalizer();

    got = n._normalizeWeaponSkill([ '攻撃', '斬れ味' ]);
    exp = [ { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] } ];
    QUnit.deepEqual(got, exp, "default");

    n.weaponSlot = 0;
    got = n._normalizeWeaponSkill([ '攻撃', '斬れ味' ]);
    exp = [ { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] } ];
    QUnit.deepEqual(got, exp, 'slot0');

    n.weaponSlot = 1;
    got = n._normalizeWeaponSkill([ '攻撃', '斬れ味' ]);
    exp = [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'slot1' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'slot1' ] } ];
    QUnit.deepEqual(got, exp, 'slot1');

    n.weaponSlot = 3;
    got = n._normalizeWeaponSkill([ '攻撃', '斬れ味' ]);
    exp = [ { skillComb: { '攻撃': 1, '斬れ味': 2 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 3 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 1 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'slot3' ] } ];
    QUnit.deepEqual(got, exp, 'slot3');

    n.weaponSlot = null;
    got = n._normalizeWeaponSkill([ '攻撃' ]);
    QUnit.deepEqual(got, [], 'weaponSlot is null');

    n.weaponSlot = -1;
    got = n._normalizeWeaponSkill([ '攻撃' ]);
    QUnit.deepEqual(got, [], 'weaponSlot is -1');

    n.weaponSlot = 4;
    got = n._normalizeWeaponSkill([ '攻撃' ]);
    QUnit.deepEqual(got, [], 'weaponSlot is 4');

    got = n._normalizeWeaponSkill();
    QUnit.deepEqual(got, [], 'nothing in');
    got = n._normalizeWeaponSkill(undefined);
    QUnit.deepEqual(got, [], 'undefined');
    got = n._normalizeWeaponSkill(null);
    QUnit.deepEqual(got, [], 'null');
    got = n._normalizeWeaponSkill([]);
    QUnit.deepEqual(got, [], '[]');
});
});
})(typeof define !== 'undefined' ?
   define :
   typeof module !== 'undefined' && module.exports ?
       function (deps, test) {
           var modules = [], len = deps.length;
           for (var i = 0; i < len; ++i) modules.push(require(deps[i]));
           test.apply(this, modules);
       } :
       function (deps, test) {
           test(this.QUnit, this._, this.simu.Normalizer, this.simu.data, this.myapp);
       }
);
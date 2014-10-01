'use strict';
var assert = require('power-assert'),
    _ = require('underscore'),
    Normalizer = require('../../../lib/equip/normalizer.js'),
    data = require('../../../lib/data.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('30_equip/19_normalizer', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    var sorter = function (actiCombs) {
        return _.sortBy(actiCombs, function (comb) {
            return _.reduce(comb.skillComb, function (memo, pt, skill) {
                return memo + skill + pt;
            }, '');
        });
    };

    describe('normalize', function () {
        var n = new Normalizer();

        it('normalize', function () {
            // 村のみに装備をしぼってスキルの組み合わせ
            myapp.setup({ context: { hr: 1, vs: 6 } });
            n.initialize();

            var bulksSet = n.normalize([ '攻撃力UP【大】', '業物' ]);
            got = sorter(bulksSet.head);
            exp = [
                { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
                { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'slot1' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'slot1' ] },
                { skillComb: { '攻撃': 1, '斬れ味': 1 }, equips: [ 'slot2' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'slot2' ] },
                { skillComb: { '攻撃': 3, '斬れ味': 0 },
                  equips: [ 'slot2', 'ランポスヘルム', 'クックヘルム', 'レウスヘルム' ] },
                { skillComb: { '攻撃': 1, '斬れ味': 2 },
                  equips: [ 'slot3', 'ランポスキャップ', 'ギザミヘルム' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 3 },
                  equips: [ 'slot3', 'ギザミヘルム' ] },
                { skillComb: { '攻撃': 2, '斬れ味': 1 },
                  equips: [ 'ランポスヘルム', 'ランポスキャップ', 'クックヘルム' ] },
                { skillComb: { '攻撃': 4, '斬れ味': 0 },
                  equips: [ 'slot3', 'ランポスキャップ', 'ボロスヘルム', 'ボロスキャップ',
                            'レックスヘルム', 'レウスキャップ' ] },
                { skillComb: { '攻撃': 3, '斬れ味': 1 },
                  equips: [ 'slot3', 'バトルヘルム', 'バトルキャップ', 'クックキャップ',
                            'ボロスヘルム', 'ボロスキャップ', 'レックスヘルム' ] },
                { skillComb: { '攻撃': 2, '斬れ味': 2 },
                  equips: [ 'バトルヘルム', 'バトルキャップ', 'クックキャップ' ] },
                { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'セルタスヘルム' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'セルタスヘルム' ] },
                { skillComb: { '攻撃': 5, '斬れ味': 0 },
                  equips: [ 'バトルヘルム', 'バトルキャップ', 'クックキャップ',
                            'レックスキャップ', 'ドボルキャップ' ] },
                { skillComb: { '攻撃': 4, '斬れ味': 1 },
                  equips: [ 'レックスキャップ', 'ドボルヘルム', 'ドボルキャップ' ] },
                { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'ドボルヘルム' ] },
                { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ 'ドボルヘルム' ] },
                { skillComb: { '攻撃': -2, '斬れ味': 0 },
                  equips: [ 'ブナハハット', 'ブナハキャップ' ] }
            ];
            assert.deepEqual(got, sorter(exp), 'head');
            got = bulksSet.weapon;
            assert.deepEqual(got, [], 'weapon');
            got = bulksSet.oma;
            assert.deepEqual(got, [], 'oma');
        });

        it('gunner', function () {
            myapp.setup({ context: { type: 'g', hr: 1, vs: 6 } });
            n.initialize();

            var bulksSet = n.normalize([ '攻撃力UP【大】', '通常弾・連射矢UP' ]);
            got = sorter(bulksSet.body);
            exp = [
                { skillComb: { '攻撃': 0, '通常弾強化': 0 }, equips: [ 'slot0' ] },
                { skillComb: { '攻撃': 1, '通常弾強化': 0 },
                  equips: [ 'slot1', 'バトルレジスト', 'ボロスレジスト' ] },
                { skillComb: { '攻撃': 0, '通常弾強化': 1 }, equips: [ 'slot1' ] },
                { skillComb: { '攻撃': 2, '通常弾強化': 0 },
                  equips: [ 'ランポスレジスト', 'レウスレジスト' ] },
                { skillComb: { '攻撃': 1, '通常弾強化': 1 }, equips: [ 'slot2' ] },
                { skillComb: { '攻撃': 0, '通常弾強化': 2 }, equips: [ 'slot2' ] },
                { skillComb: { '攻撃': 3, '通常弾強化': 0 },
                  equips: [ 'slot2', 'クックレジスト' ] },
                { skillComb: { '攻撃': 2, '通常弾強化': 1 },
                  equips: [ 'クックレジスト', 'ドボルレジスト' ] },
                { skillComb: { '攻撃': 1, '通常弾強化': 2 },
                  equips: [ 'ガンキンレジスト', 'ドボルレジスト' ] },
                { skillComb: { '攻撃': 0, '通常弾強化': 3 }, equips: [ 'ガンキンレジスト' ] },
                { skillComb: { '攻撃': 3, '通常弾強化': 1 }, equips: [ 'レックスレジスト' ] },
                { skillComb: { '攻撃': 2, '通常弾強化': 2 }, equips: [ 'レックスレジスト' ] },
                { skillComb: { '攻撃': 4, '通常弾強化': 0 }, equips: [ 'ドボルレジスト' ] },
                { skillComb: { '攻撃': 5, '通常弾強化': 0 }, equips: [ 'レックスレジスト' ] },
                { skillComb: { '攻撃': -2, '通常弾強化': 0 }, equips: [ 'ブナハベスト' ] }
            ];
            assert.deepEqual(got, sorter(exp));
        });

        it('torsoUp', function () {
            myapp.setup({ context: { hr: 1, vs: 6 } });
            n.initialize();

            var bulksSet = n.normalize([ '集中', '弱点特効' ]);
            got = sorter(bulksSet.leg);
            exp = [
                { skillComb: { '溜め短縮': 0, '痛撃': 0 }, equips: [ 'slot0' ] },
                { skillComb: { '胴系統倍化': 1 }, equips: [ '胴系統倍化' ] },
                { skillComb: { '溜め短縮': 0, '痛撃': 1 }, equips: [ 'slot1' ] },
                { skillComb: { '溜め短縮': 1, '痛撃': 0 }, equips: [ 'slot1' ] },
                { skillComb: { '溜め短縮': 0, '痛撃': 2 }, equips: [ 'slot2' ] },
                { skillComb: { '溜め短縮': 1, '痛撃': 1 }, equips: [ 'slot2' ] },
                { skillComb: { '溜め短縮': 2, '痛撃': 0 }, equips: [ 'slot2' ] },
                { skillComb: { '溜め短縮': 0, '痛撃': 3 }, equips: [ 'slot3' ] },
                { skillComb: { '溜め短縮': 1, '痛撃': 2 }, equips: [ 'slot3' ] },
                { skillComb: { '溜め短縮': 2, '痛撃': 1 }, equips: [ 'slot3' ] },
                { skillComb: { '溜め短縮': 3, '痛撃': 0 }, equips: [ 'slot3' ] }
            ];
            assert.deepEqual(got, sorter(exp));
        });

        it('null or etc', function () {
            got = n.normalize();
            assert.deepEqual(got, null, 'nothing in');
            got = n.normalize(undefined);
            assert.deepEqual(got, null, 'undefined');
            got = n.normalize(null);
            assert.deepEqual(got, null, 'null');
            assert.deepEqual(n.normalize([]), null, '[]');
        });
    });

    var summary = function (bulks) {
        var ret = {};
        _.each(bulks, function (bulk, part) { ret[part] = bulk.length; });
        return ret;
    };

    describe('normalize: selected equips', function () {
        var n = new Normalizer();

        it('fixed equip', function () {
            // スキルポイントがマイナスの装備で固定
            data.equips.body = [
                myapp.equip('body', 'アカムトウルンテ') // 斬れ味-2, スロ1
            ];
            n.initialize();

            var bulksSet = n.normalize([ '攻撃力UP【大】', '業物' ]);
            got = bulksSet.body;
            exp = [
                { skillComb: { '攻撃': 1, '斬れ味': -2 }, equips: [ 'アカムトウルンテ' ] },
                { skillComb: { '攻撃': 0, '斬れ味': -1 }, equips: [ 'アカムトウルンテ' ] }
            ];
            assert.deepEqual(got, exp, 'body');
            got = summary(bulksSet);
            exp = { head: 37, body: 2, arm: 29, waist: 30, leg: 36, weapon: 0, oma: 0 };
            assert.deepEqual(got, exp, 'summary');
        });

        it('selected equip', function () {
            // スキルポイントがマイナスの装備が複数
            data.equips.body = [
                myapp.equip('body', 'ブナハＳスーツ'),   // 攻撃-2, スロ0
                myapp.equip('body', 'リベリオンメイル'), // 攻撃-4, スロ1
                myapp.equip('body', 'アカムトウルンテ')  // 斬れ味-2, スロ1
            ];
            n.initialize();

            var bulksSet = n.normalize([ '攻撃力UP【大】', '業物' ]);
            got = summary(bulksSet);
            exp = { head: 37, body: 5, arm: 29, waist: 30, leg: 36, weapon: 0, oma: 0 };
            assert.deepEqual(got, exp);
        });
    });

    describe('normalize: weapon slot', function () {
        var n = new Normalizer();

        it('weaponSlot: 0', function () {
            myapp.setup({ weaponSlot: 0 });
            n.initialize();

            var bulksSet = n.normalize([ '攻撃力UP【大】', '業物' ]);
            got = bulksSet.weapon;
            exp = [
                { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] }
            ];
            assert.deepEqual(got, exp);
        });

        it('weaponSlot: 3', function () {
            myapp.setup({ weaponSlot: 3 });
            n.initialize();

            var bulksSet = n.normalize([ '攻撃力UP【大】', '業物' ]);
            got = bulksSet.weapon;
            exp = [
                { skillComb: { '攻撃': 1, '斬れ味': 2 }, equips: [ 'slot3' ] },
                { skillComb: { '攻撃': 3, '斬れ味': 1 }, equips: [ 'slot3' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'slot3' ] },
                { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'slot3' ] }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('normalize: oma', function () {
        var n = new Normalizer();

        it('oma', function () {
            myapp.setup({
                context: { hr: 1, vs: 6 },
                omas: [
                    [ '龍の護石',3,'匠',4,'氷耐性',-5 ],
                    [ '龍の護石',0,'溜め短縮',5,'攻撃',9 ],
                    [ '龍の護石',3,'痛撃',4 ]
                ]
            });
            n.initialize();

            var bulksSet = n.normalize([ '斬れ味レベル+1', '攻撃力UP【中】', '耳栓' ]);
            got = bulksSet.oma;
            exp = [
                // slot3 は「龍の護石(スロ3,痛撃+4)」の分
                { skillComb: { '匠': 0, '攻撃': 0, '聴覚保護': 3 },
                  equips: [ 'slot3' ] },
                { skillComb: { '匠': 0, '攻撃': 1, '聴覚保護': 2 },
                  equips: [ 'slot3' ] },
                { skillComb: { '匠': 0, '攻撃': 3, '聴覚保護': 1 },
                  equips: [ 'slot3' ] },
                { skillComb: { '匠': 0, '攻撃': 4, '聴覚保護': 0 },
                  equips: [ 'slot3' ] },
                { skillComb: { '匠': 4, '攻撃': 0, '聴覚保護': 3 },
                  equips: [ '龍の護石(スロ3,匠+4,氷耐性-5)' ] },
                { skillComb: { '匠': 4, '攻撃': 1, '聴覚保護': 2 },
                  equips: [ '龍の護石(スロ3,匠+4,氷耐性-5)' ] },
                { skillComb: { '匠': 4, '攻撃': 3, '聴覚保護': 1 },
                  equips: [ '龍の護石(スロ3,匠+4,氷耐性-5)' ] },
                { skillComb: { '匠': 4, '攻撃': 4, '聴覚保護': 0 },
                  equips: [ '龍の護石(スロ3,匠+4,氷耐性-5)' ] },
                { skillComb: { '匠': 0, '攻撃': 9, '聴覚保護': 0 },
                  equips: [ '龍の護石(スロ0,溜め短縮+5,攻撃+9)' ] }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('normalize: dig', function () {
        var n = new Normalizer();

        it('dig: weapon', function () {
            myapp.setup({
                omas: [
                    [ '龍の護石',3,'匠',4,'氷耐性',-5 ],
                    [ '龍の護石',0,'溜め短縮',5,'攻撃',9 ],
                    [ '龍の護石',3,'痛撃',4 ]
                ],
                dig: true
            });
            n.initialize();

            var bulksSet = n.normalize([ '真打', '集中', '弱点特効', '耳栓' ]);
            got = bulksSet.weapon;
            exp = [
                { skillComb: { '刀匠': 0, '溜め短縮': 0, '痛撃': 0, '聴覚保護': 0 },
                  equips: [ 'slot0' ] },
                { skillComb: { '刀匠': 2, '溜め短縮': 0, '痛撃': 0, '聴覚保護': 0 },
                  equips: [ '発掘(刀匠+2)' ] },
                { skillComb: { '刀匠': 3, '溜め短縮': 0, '痛撃': 0, '聴覚保護': 0 },
                  equips: [ '発掘(刀匠+3)' ] },
                { skillComb: { '刀匠': 4, '溜め短縮': 0, '痛撃': 0, '聴覚保護': 0 },
                  equips: [ '発掘(刀匠+4)' ] }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('normalize: summary', function () {
        var n = new Normalizer();

        it("[ '攻撃力UP【大】', '業物' ]", function () {
            var bulksSet = n.normalize([ '攻撃力UP【大】', '業物' ]);
            got = summary(bulksSet);
            exp = { head: 37, body: 29, arm: 29, waist: 30, leg: 36, weapon: 0, oma: 0 };
            assert.deepEqual(got, exp);
        });

        it("[ '斬れ味レベル+1', '高級耳栓' ]", function () {
            var bulksSet = n.normalize([ '斬れ味レベル+1', '高級耳栓' ]);
            got = summary(bulksSet);
            exp = { head: 19, body: 16, arm: 21, waist: 21, leg: 24, weapon: 0, oma: 0 };
            assert.deepEqual(got, exp);
        });

        it("[ '斬れ味レベル+1', '耳栓' ]", function () {
            // スキル系統で見ているので、高級耳栓も耳栓も結果は同じ
            var bulksSet = n.normalize([ '斬れ味レベル+1', '耳栓' ]);
            got = summary(bulksSet);
            exp = { head: 19, body: 16, arm: 21, waist: 21, leg: 24, weapon: 0, oma: 0 };
            assert.deepEqual(got, exp);
        });

        it("[ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]", function () {
            var skills = [ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ],
                bulksSet = n.normalize(skills);
            got = summary(bulksSet);
            exp = { head: 444, body: 229, arm: 250, waist: 343, leg: 282, weapon: 0, oma: 0 };
            assert.deepEqual(got, exp);
        });
    });
});
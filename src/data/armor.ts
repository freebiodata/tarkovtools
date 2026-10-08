/**
 * Tarkov armor dataset (body armor + plates).
 *
 * Source: tarkovdb.gg armor chart (fetched 2026-10-08 via r.jina.ai),
 * cross-checked against community data. Snapshot: 2026-10-08.
 */

export interface ArmorItem {
  name: string;
  cls: number; // protection class 1-6
  durability: number;
  material: string;
}

export const bodyArmor: ArmorItem[] = [
  { name: "NPP KlASS Korund-VM body armor (Black)", cls: 2, durability: 160, material: "Aramid" },
  { name: "NPP KlASS Korund-VM body armor (Kamysh)", cls: 2, durability: 160, material: "Aramid" },
  { name: "6B23-1 body armor (EMR)", cls: 2, durability: 156, material: "Aramid" },
  { name: "6B23-2 body armor (Mountain Flora)", cls: 2, durability: 156, material: "Aramid" },
  { name: "BNTI Kirasa-N body armor", cls: 2, durability: 150, material: "Aramid" },
  { name: "BNTI Kirasa-N body armor (Green)", cls: 2, durability: 150, material: "Aramid" },
  { name: "Interceptor OTV body armor (UCP)", cls: 2, durability: 132, material: "Aramid" },
  { name: "Interceptor OTV body armor (Woodland)", cls: 2, durability: 132, material: "Aramid" },
  { name: "6B2 body armor (Flora)", cls: 2, durability: 128, material: "Titan" },
  { name: "BNTI Zhuk body armor (Press)", cls: 2, durability: 110, material: "Aramid" },
  { name: "6B13 assault armor (EMR)", cls: 2, durability: 108, material: "Aramid" },
  { name: "6B13 assault armor (Flora)", cls: 2, durability: 108, material: "Aramid" },
  { name: "PACA Soft Armor", cls: 2, durability: 100, material: "Aramid" },
  { name: "PACA Soft Armor (Rivals Edition)", cls: 2, durability: 100, material: "Aramid" },
  { name: "BNTI Module-3M body armor", cls: 2, durability: 80, material: "Aramid" },
  { name: "Blue Force Gear PLATEminus V2 body armor (Coyote Brown)", cls: 2, durability: 68, material: "\u2014" },
  { name: "Blue Force Gear PLATEminus V2 body armor (Wolf Gray)", cls: 2, durability: 68, material: "\u2014" },
  { name: "FORT Redut-T5 body armor (Smog)", cls: 3, durability: 354, material: "Aramid" },
  { name: "6B43 Zabralo-Sh body armor (EMR)", cls: 3, durability: 350, material: "Aramid" },
  { name: "NFM THOR Integrated Carrier body armor", cls: 3, durability: 310, material: "Aramid" },
  { name: "6B45 body armor (EMR)", cls: 3, durability: 254, material: "Aramid" },
  { name: "FORT Redut-M body armor", cls: 3, durability: 248, material: "Aramid" },
  { name: "FORT Redut-M body armor (Black)", cls: 3, durability: 248, material: "Aramid" },
  { name: "FORT Redut-M body armor (Prisoner of the Arena)", cls: 3, durability: 248, material: "Aramid" },
  { name: "FORT Redut-M body armor (SK Woodland)", cls: 3, durability: 248, material: "Aramid" },
  { name: "IOTV Gen4 body armor (Full Protection Kit, MultiCam)", cls: 3, durability: 248, material: "Aramid" },
  { name: "FORT Gladiator-S plate carrier (Gray)", cls: 3, durability: 235, material: "Aramid" },
  { name: "IOTV Gen4 body armor (Assault Kit, MultiCam)", cls: 3, durability: 212, material: "Aramid" },
  { name: "FORT Defender-2 body armor", cls: 3, durability: 210, material: "Aramid" },
  { name: "FORT Defender-2 body armor (Flecktarn)", cls: 3, durability: 210, material: "Aramid" },
  { name: "IOTV Gen4 body armor (High Mobility Kit, MultiCam)", cls: 3, durability: 200, material: "Aramid" },
  { name: "BNTI Zhuk body armor (EMR)", cls: 3, durability: 165, material: "Aramid" },
  { name: "6B13 M assault armor (Killa Edition)", cls: 3, durability: 154, material: "Aramid" },
  { name: "BNTI Gzhel-K body armor", cls: 3, durability: 154, material: "Aramid" },
  { name: "NPP KlASS Kora-Kulon body armor (Black)", cls: 3, durability: 128, material: "Armor steel" },
  { name: "NPP KlASS Kora-Kulon body armor (EMR)", cls: 3, durability: 128, material: "Armor steel" },
  { name: "DRD body armor", cls: 3, durability: 120, material: "Aramid" },
  { name: "HighCom Trooper TFO body armor (Coyote)", cls: 3, durability: 100, material: "Aramid" },
  { name: "HighCom Trooper TFO body armor (MultiCam)", cls: 3, durability: 100, material: "Aramid" },
  { name: "LBT-6094A Slick Plate Carrier (Black)", cls: 3, durability: 100, material: "Aramid" },
  { name: "LBT-6094A Slick Plate Carrier (Coyote Tan)", cls: 3, durability: 100, material: "Aramid" },
  { name: "LBT-6094A Slick Plate Carrier (Olive Drab)", cls: 3, durability: 100, material: "Aramid" },
  { name: "MF-UNTAR body armor", cls: 3, durability: 100, material: "Aluminium" },
  { name: "NFM THOR Concealable Reinforced Vest body armor", cls: 3, durability: 70, material: "Aramid" },
  { name: "NFM THOR Concealable Reinforced Vest body armor (Head Eyes)", cls: 3, durability: 70, material: "Aramid" },
];

export const armorPlates: ArmorItem[] = [
  { name: "Tac-Kek SAPI Level III+ ballistic plate (Replica)", cls: 1, durability: 90, material: "UHMWPE" },
  { name: "6B12 ballistic plates (Front)", cls: 3, durability: 50, material: "Armor steel" },
  { name: "AR500 Legacy Plate ballistic plate", cls: 3, durability: 45, material: "Combined materials" },
  { name: "Zhuk-3 ballistic plate (Front)", cls: 3, durability: 40, material: "UHMWPE" },
  { name: "PRTCTR Lightweight ballistic plate", cls: 3, durability: 35, material: "UHMWPE" },
  { name: "Kiba Arms Titan ballistic plate", cls: 4, durability: 55, material: "Titan" },
  { name: "6B33 ballistic plate (Front)", cls: 4, durability: 50, material: "Armor steel" },
  { name: "SPRTN Omega ballistic plate", cls: 4, durability: 50, material: "Combined materials" },
  { name: "6B13 custom ballistic plates (Back)", cls: 4, durability: 45, material: "Armor steel" },
  { name: "Global Armor\u2019s Steel ballistic plate", cls: 4, durability: 45, material: "Armor steel" },
  { name: "NewSphereTech level III ballistic plate", cls: 4, durability: 45, material: "Aluminum" },
  { name: "SPRTN Elaphros ballistic plate", cls: 4, durability: 45, material: "Ceramic" },
  { name: "6B23-2 ballistic plate (Back)", cls: 4, durability: 40, material: "Armor steel" },
  { name: "Monoclete level III PE ballistic plate", cls: 4, durability: 40, material: "UHMWPE" },
  { name: "Cult Locust ballistic plate", cls: 5, durability: 60, material: "Titan" },
  { name: "Korund-VM ballistic plates (Front)", cls: 5, durability: 60, material: "Armor steel" },
  { name: "Granit Br4 ballistic plate", cls: 5, durability: 55, material: "Ceramic" },
  { name: "TallCom Guardian ballistic plate", cls: 5, durability: 55, material: "Combined materials" },
  { name: "Granit 4 ballistic plate (Front)", cls: 5, durability: 50, material: "Ceramic" },
  { name: "SAPI level III+ ballistic plate", cls: 5, durability: 50, material: "Ceramic" },
  { name: "GAC 3s15m ballistic plate", cls: 5, durability: 45, material: "UHMWPE" },
  { name: "Granit 4 ballistic plates (Back)", cls: 5, durability: 45, material: "Ceramic" },
  { name: "Korund-VM ballistic plate (Back)", cls: 5, durability: 40, material: "Armor steel" },
  { name: "Korund-VM ballistic plate (Side)", cls: 5, durability: 25, material: "Armor steel" },
  { name: "SSAPI level III+ ballistic plate (Side)", cls: 5, durability: 15, material: "Ceramic" },
  { name: "Cult Termite ballistic plate", cls: 6, durability: 65, material: "Titan" },
  { name: "Granit Br5 ballistic plate", cls: 6, durability: 60, material: "Ceramic" },
  { name: "Korund-VM-K ballistic plates (Front)", cls: 6, durability: 60, material: "Ceramic" },
  { name: "NESCO 4400-SA-MC ballistic plate", cls: 6, durability: 60, material: "Combined materials" },
  { name: "ESAPI level IV ballistic plate", cls: 6, durability: 55, material: "Ceramic" },
  { name: "Granit 4RS ballistic plate (Front)", cls: 6, durability: 55, material: "Ceramic" },
  { name: "GAC 4sss2 ballistic plate", cls: 6, durability: 50, material: "UHMWPE" },
  { name: "Granit 4RS ballistic plates (Back)", cls: 6, durability: 50, material: "Ceramic" },
  { name: "Kiba Arms Steel ballistic plate", cls: 6, durability: 50, material: "Armor steel" },
  { name: "KITECO SC-IV SA ballistic plate", cls: 6, durability: 45, material: "UHMWPE" },
  { name: "Korund-VM-K ballistic plate (Back)", cls: 6, durability: 45, material: "Ceramic" },
  { name: "Granit ballistic plate (Side)", cls: 6, durability: 20, material: "Ceramic" },
  { name: "ESBI level IV ballistic plate (Side)", cls: 6, durability: 18, material: "Ceramic" },
];

/** Armor material destructibility (from community datamining; higher = wears faster) */
export const destructibility: Record<string, number> = {
  Aramid: 0.1875,
  UHMWPE: 0.3375,
  Combined: 0.375,
  Titan: 0.4125,
  Aluminium: 0.45,
  ArmoredSteel: 0.525,
  Ceramic: 0.55,
  Glass: 0.6,
};

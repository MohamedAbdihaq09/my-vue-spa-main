// src/data/smkFloorPlans.js
//
// SMK floor plans, traced from the official plan screenshots (Floor 0-3).
// Coordinates are the pixel coordinates of each source image; `transform`
// fits every level into the shared VIEWBOX so the tabs never change size.
//
// Drawing model (see MuseumMapView.vue):
//   shell  - building footprint, filled with the wall colour
//   spaces - unnamed corridors/rooms (h: hatched), not selectable
//   voids  - open-air / atrium areas, drawn in the background colour
//   rooms  - selectable places; walls are the gaps left between shapes
// Generated file: edit geometry here, never in the template.

export const VIEWBOX = '0 0 1200 660'

export const levels = [
  {
    id: 'ground',
    number: 0,
    planAvailable: true,
    transform: 'translate(277.4 -3.6) scale(0.9572)',
    shell: "M124 435L123 664L183 664L184 566L214 568L214 648L419 649L420 564L441 565L441 618L459 618L465 625L465 640L575 639L575 585L510 585L501 577L501 547L617 547L617 381L498 381L497 436L445 436L444 383L330 382L321 378L304 378L294 382L181 382L180 435Z",
    walls: "",
    voids: [],
    spaces: [
      { d: "M126 661L180 661L180 477L369 477L370 560L431 561L431 480L497 479L497 440L309 441L127 438Z", h: false },
      { d: "M496 481L444 481L444 615L461 615L460 600L463 592L471 583L483 578L498 579Z", h: false },
      { d: "M510 588L511 612L501 624L501 636L572 636L572 588Z", h: false },
      { d: "M468 626L468 637L496 637L496 629L483 630Z", h: false },
    ],
    rooms: [
      { placeId: 'restrooms', d: "M184 385L184 436L441 436L441 385Z", h: false, noLabel: true, x: 312, y: 410, fs: 24, lw: 249 },
      { placeId: 'lockers', d: "M184 481L183 563L219 564L219 574L217 575L217 645L416 646L416 564L371 564L371 574L369 574L365 546L366 482Z", h: false, x: 275, y: 521, fs: 21.0, lw: 170 },
      { placeId: 'biograf', d: "M501 384L501 543L614 544L614 384Z", h: false, x: 558, y: 464, fs: 24, lw: 106 },
    ],
    icons: [
      { type: 'stairs', x: 81, y: 58, r: 24 },
      { type: 'stairs', x: 544, y: 57, r: 24 },
      { type: 'lift', x: 126, y: 141, r: 24 },
      { type: 'lift', x: 500, y: 140, r: 24 },
      { type: 'wc', x: 312, y: 410, r: 24 },
      { type: 'stairs', x: 486, y: 604, r: 24 },
    ],
  },
  {
    id: 'first',
    number: 1,
    planAvailable: true,
    transform: 'translate(-33.3 -64.6) scale(1.0752)',
    shell: "M57 158L57 191L115 209L114 277L118 278L117 339L215 339L216 349L298 349L298 386L244 386L244 479L259 480L259 534L336 534L336 522L329 511L329 499L335 490L335 479L374 478L375 489L382 500L382 510L376 521L376 533L448 533L449 548L485 548L486 520L499 521L499 539L614 539L615 519L627 519L628 531L735 530L735 518L729 508L729 498L734 489L734 478L753 476L777 478L777 489L782 497L782 509L777 517L777 529L852 529L852 478L893 477L893 384L891 383L891 376L893 370L892 345L894 344L894 338L954 337L955 334L971 334L972 337L994 337L994 314L991 313L991 297L994 296L994 274L1007 272L1039 272L1040 234L1121 234L1121 207L883 179L871 261L871 273L857 274L855 258L855 173L752 157L741 157L740 154L420 110L408 110L401 155L255 158L254 197L266 198L266 275L202 274L195 261L196 158Z",
    walls: "",
    voids: ["M452 325L453 356L479 356L479 325Z", "M633 326L633 341L661 342L661 326Z", "M453 375L454 390L479 390L479 375Z"],
    spaces: [
      { d: "M874 274L990 274L991 270L1036 269L1036 231L1118 231L1118 210L886 182Z", h: false },
      { d: "M269 199L269 262L333 262L333 200Z", h: false },
      { d: "M667 347L667 354L670 358L668 383L701 383L703 375L701 347Z", h: true },
      { d: "M816 347L816 362L823 367L821 382L849 382L848 346Z", h: true },
      { d: "M743 347L743 354L748 358L748 382L775 382L774 347Z", h: true },
      { d: "M453 358L453 373L479 373L479 358Z", h: false },
    ],
    rooms: [
      { placeId: 'room-114', number: '114', d: "M60 161L60 188L118 206L117 274L148 274L157 261L171 255L192 260L193 161Z", h: true, x: 155, y: 209, fs: 24, lw: 67 },
      { placeId: 'room-117', number: '117', d: "M258 161L257 194L337 195L338 262L371 263L372 193L370 160Z", h: true, x: 333, y: 183, fs: 22.8, lw: 106 },
      { placeId: 'scene', d: "M375 158L375 201L382 202L382 206L376 210L376 264L409 264L409 237L404 237L404 235L411 236L411 264L700 264L701 247L702 264L736 264L737 223L735 220L737 207L711 207L710 205L737 204L737 157L411 113L405 157Z", h: false, x: 516, y: 196, fs: 24, lw: 354 },
      { placeId: 'auditorium', d: "M742 160L741 220L743 230L741 231L741 273L853 274L852 176Z", h: false, x: 797, y: 221, fs: 24, lw: 103 },
      { placeId: 'skulpturgaden', d: "M120 336L218 336L219 346L450 343L449 319L451 309L497 310L496 312L452 311L452 324L479 324L480 322L496 321L661 324L662 342L891 341L892 334L951 334L951 328L944 323L937 310L938 297L948 285L948 279L737 278L736 268L269 266L270 276L268 279L199 277L198 290L193 298L184 305L175 308L161 305L153 298L147 286L147 279L121 279Z", h: true, x: 640, y: 296, fs: 21.0, lw: 240 },
      { placeId: 'room-110', number: '110', d: "M301 348L302 384L369 384L369 348Z", h: true, x: 335, y: 366, fs: 24, lw: 60 },
      { placeId: 'room-109', number: '109', d: "M374 348L374 384L449 383L449 348Z", h: true, x: 412, y: 366, fs: 24, lw: 67 },
      { placeId: 'room-112', number: '112', d: "M484 327L484 389L625 388L625 381L619 370L619 362L628 347L628 327Z", h: true, x: 552, y: 358, fs: 24, lw: 129 },
      { placeId: 'room-103', number: '103', d: "M706 347L706 383L736 382L735 374L738 373L738 360L735 359L738 356L738 347Z", h: true, x: 721, y: 365, fs: 24, lw: 24 },
      { placeId: 'room-105', number: '105', d: "M780 347L780 382L810 382L808 374L811 372L811 366L809 365L811 347Z", h: true, x: 795, y: 365, fs: 24, lw: 21 },
      { placeId: 'room-107', number: '107', d: "M854 346L854 382L887 382L890 367L889 346Z", h: true, x: 872, y: 364, fs: 24, lw: 28 },
      { placeId: 'room-108', number: '108', d: "M247 389L247 476L449 475L449 389Z", h: true, x: 348, y: 432, fs: 24, lw: 194 },
      { placeId: 'room-101', number: '101', d: "M662 388L663 474L749 474L752 472L763 474L890 474L890 387Z", h: true, x: 778, y: 431, fs: 24, lw: 220 },
      { placeId: 'forhal', d: "M453 392L452 545L482 545L483 517L501 517L502 536L611 536L612 516L630 516L631 528L658 529L658 392L600 393L599 402L588 402L586 393Z", h: false, x: 549, y: 463, fs: 24, lw: 197 },
      { placeId: 'shop', d: "M262 480L262 531L449 531L449 480Z", h: false, x: 355, y: 552, fs: 22, lw: 220, outside: true },
      { placeId: 'cafe', d: "M663 479L663 527L849 527L849 479Z", h: false, x: 757, y: 549, fs: 22, lw: 220, outside: true },
    ],
    icons: [
      { type: 'stairs', x: 173, y: 282, r: 24 },
      { type: 'stairs', x: 685, y: 203, r: 24 },
      { type: 'stairs', x: 963, y: 305, r: 24 },
      { type: 'stairs', x: 645, y: 366, r: 24 },
      { type: 'shop', x: 355, y: 506, r: 24 },
      { type: 'cafe', x: 756, y: 504, r: 24 },
      { type: 'entrance', x: 557, y: 573, r: 23 },
    ],
    entranceLabel: { x: 557, y: 612 },
  },
  {
    id: 'second',
    number: 2,
    planAvailable: true,
    transform: 'translate(-23.2 27.0) scale(1.0447)',
    shell: "M49 105L49 119L66 119L68 122L84 122L86 145L107 151L107 220L191 220L192 183L221 182L222 222L245 222L248 182L262 181L263 221L391 221L391 185L393 180L409 182L409 220L420 221L419 295L214 296L213 311L178 311L177 284L103 284L103 333L105 334L105 348L103 350L104 523L175 523L176 477L214 477L215 487L450 487L451 501L486 501L487 493L634 492L636 501L672 501L673 487L911 486L912 473L935 474L935 521L1022 521L1023 380L1022 338L1018 337L1018 331L1022 330L1021 271L909 271L908 293L705 294L704 220L713 219L713 181L723 180L724 178L732 179L732 219L867 219L868 231L919 231L919 218L890 217L894 179L910 179L911 190L941 190L942 217L1057 217L1058 177L1144 176L1144 155L945 129L897 121L872 120L866 117L702 95L680 94L672 91L567 78L564 76L427 57L413 57L412 103Z",
    walls: "M275 338L275 416M272 384L319 384M333.5 354L333.5 432M348 384L398 384M392.5 338L392.5 416M730.5 350L730.5 432M790.5 337L790.5 386M788 384.5L853 384.5M849.5 384L849.5 432M575.5 180L575.5 219M316.5 180L316.5 222",
    voids: ["M681 123L681 132L711 132L711 123Z", "M412 125L412 133L443 133L443 125Z", "M434 219L434 293L451 293L452 289L482 289L482 271L485 269L640 269L641 288L670 288L671 292L690 292L690 218L682 218L680 214L662 214L661 222L464 222L462 214L443 214L442 218Z", "M486 369L485 471L636 471L636 434L630 434L620 443L607 446L594 440L586 431L583 422L586 408L593 397L613 394L627 399L636 399L636 370Z"],
    spaces: [
      { d: "M455 340L455 378L458 384L458 392L455 393L454 498L483 498L484 490L637 489L639 498L669 498L669 488L667 487L666 339ZM484 369L637 368L638 400L631 401L631 407L638 410L637 472L485 472Z", h: true },
      { d: "M148 335L151 359L146 364L146 394L148 395L146 474L213 474L212 335Z", h: true },
      { d: "M977 332L912 333L913 470L978 470Z", h: true },
      { d: "M423 293L433 293L432 218L439 217L440 179L462 178L463 176L681 177L683 180L683 216L710 216L710 178L720 177L720 166L709 167L708 165L444 166L436 164L436 134L417 134L417 164L404 166L404 178L412 179L412 217L423 218Z", h: false },
      { d: "M725 165L725 175L735 176L735 216L858 216L858 176L869 174L868 165Z", h: true },
      { d: "M250 168L250 178L266 179L266 218L388 218L388 206L375 205L375 182L389 181L390 177L399 177L399 167ZM316 181L324 181L329 185L327 193L321 197L320 206L315 205Z", h: true },
      { d: "M950 274L950 290L960 290L966 294L965 303L952 303L951 327L990 327L991 318L1002 318L1003 327L1019 327L1018 274Z", h: true },
      { d: "M486 274L487 335L536 335L536 274Z", h: true },
      { d: "M588 274L588 335L636 335L636 274Z", h: true },
      { d: "M106 287L106 330L174 330L174 287Z", h: true },
      { d: "M831 296L830 333L907 333L907 315L894 314L894 310L902 302L902 296Z", h: true },
      { d: "M193 168L193 179L225 180L225 219L242 219L245 168Z", h: false },
      { d: "M373 298L373 335L408 335L408 298Z", h: true },
      { d: "M717 297L716 334L750 334L750 297Z", h: true },
      { d: "M755 297L756 334L788 333L788 297Z", h: true },
      { d: "M456 294L455 307L459 308L458 322L455 324L455 335L482 335L483 309L487 308L487 302L483 301L482 294Z", h: true },
      { d: "M641 293L641 334L667 334L666 293Z", h: true },
      { d: "M106 446L106 474L141 474L141 446Z", h: true },
      { d: "M691 218L692 292L701 292L701 218Z", h: false },
      { d: "M685 134L686 162L706 162L705 134Z", h: false },
      { d: "M179 314L179 330L212 330L212 314Z", h: false },
      { d: "M872 209L871 228L916 228L916 221L888 221L887 209Z", h: false },
      { d: "M444 184L444 210L461 210L461 184Z", h: false },
      { d: "M873 180L873 204L887 204L890 180Z", h: true },
    ],
    rooms: [
      { placeId: 'room-260', number: '260', d: "M48 106L49 119L106 148L117 151L117 106Z", h: true, x: 97, y: 123, fs: 24, lw: 52 },
      { placeId: 'room-261', number: '261', d: "M119 108L119 150L151 158L204 163L205 167L211 167L212 163L246 163L252 107Z", h: true, x: 192, y: 134, fs: 24, lw: 123 },
      { placeId: 'room-262', number: '262', d: "M258 107L252 163L408 161L408 106Z", h: true, x: 333, y: 134, fs: 24, lw: 146 },
      { placeId: 'room-272', number: '272', d: "M110 154L110 217L188 217L188 186L192 170L188 167L151 163Z", h: true, x: 147, y: 190, fs: 24, lw: 71 },
      { placeId: 'room-270b', number: '270B', d: "M317 165L317 219L390 219L390 165Z", h: true, x: 354, y: 192, fs: 24, lw: 65 },
      { placeId: 'room-263b', number: '263B', d: "M416 60L416 120L443 120L443 73L447 73L448 161L563 161L561 104L483 103L484 99L563 99L563 80Z", h: true, x: 504, y: 132, fs: 24, lw: 105 },
      { placeId: 'room-263c', number: '263C', d: "M567 81L567 161L676 160L675 95Z", h: true, x: 619, y: 124, fs: 24, lw: 101 },
      { placeId: 'room-269a', number: '269A', d: "M465 178L465 219L575 219L575 178Z", h: true, x: 520, y: 198, fs: 24, lw: 102 },
      { placeId: 'room-269b', number: '269B', d: "M576 178L576 219L680 219L680 178Z", h: true, x: 628, y: 198, fs: 24, lw: 96 },
      { placeId: 'room-264', number: '264', d: "M681 97L681 118L711 118L711 110L716 110L713 161L857 160L858 155L868 144L868 134L863 133L868 132L868 121Z", h: true, x: 761, y: 133, fs: 24, lw: 140 },
      { placeId: 'room-265', number: '265', d: "M874 123L873 160L880 160L881 164L873 165L873 175L921 176L921 181L914 181L914 187L935 187L935 177L940 176L940 164L935 163L935 141L932 141L931 137L941 137L941 131Z", h: false, x: 906, y: 151, fs: 24, lw: 54 },
      { placeId: 'room-266', number: '266', d: "M945 132L945 158L1002 158L1001 164L945 165L945 214L1054 214L1055 174L1141 173L1141 158Z", h: true, x: 1023, y: 182, fs: 24, lw: 101 },
      { placeId: 'room-220', number: '220', d: "M297 301L292 298L217 299L217 335L294 335L293 312L294 308L297 307Z", h: true, x: 256, y: 317, fs: 24, lw: 68 },
      { placeId: 'room-219', number: '219', d: "M298 298L298 335L368 335L368 298Z", h: true, x: 333, y: 316, fs: 24, lw: 62 },
      { placeId: 'room-218a', number: '218A', d: "M411 297L411 336L451 336L451 297Z", h: true, x: 431, y: 316, fs: 24, lw: 32 },
      { placeId: 'room-214', number: '214', d: "M539 271L539 337L585 337L585 271Z", h: true, x: 562, y: 304, fs: 24, lw: 38 },
      { placeId: 'room-211b', number: '211B', d: "M670 297L670 336L712 336L712 297Z", h: true, x: 691, y: 316, fs: 24, lw: 34 },
      { placeId: 'room-210a', number: '210A', d: "M791 297L791 336L827 336L827 297Z", h: true, x: 809, y: 316, fs: 24, lw: 28 },
      { placeId: 'room-208b', number: '208B', d: "M912 274L912 328L946 328L946 274Z", h: true, x: 929, y: 301, fs: 24, lw: 26 },
      { placeId: 'room-223', number: '223', d: "M104 333L104 365L143 365L143 333Z", h: true, x: 124, y: 349, fs: 24, lw: 31 },
      { placeId: 'room-224', number: '224', d: "M104 367L104 442L143 442L143 367Z", h: true, x: 124, y: 404, fs: 24, lw: 31 },
      { placeId: 'room-226', number: '226', d: "M106 479L107 520L172 520L171 479Z", h: true, x: 139, y: 500, fs: 24, lw: 57 },
      { placeId: 'room-217f', number: '217F', d: "M215 337L215 432L333 432L333 337Z", h: true, x: 245, y: 405, fs: 21.0, lw: 50 },
      { placeId: 'room-217a', number: '217A', d: "M333 337L333 432L452 432L452 337Z", h: true, x: 422, y: 405, fs: 21.0, lw: 50 },
      { placeId: 'room-227', number: '227', d: "M218 435L218 484L292 484L293 461L296 460L296 454L292 453L292 435Z", h: true, x: 256, y: 460, fs: 24, lw: 70 },
      { placeId: 'room-228', number: '228', d: "M297 435L297 484L370 483L369 435Z", h: true, x: 333, y: 459, fs: 24, lw: 64 },
      { placeId: 'room-229', number: '229', d: "M374 435L375 483L450 484L450 435Z", h: true, x: 412, y: 459, fs: 24, lw: 67 },
      { placeId: 'room-201b', number: '201B', d: "M670 337L670 432L850 432L850 385L792 385L791 337Z", h: true, x: 700, y: 405, fs: 21.0, lw: 52 },
      { placeId: 'room-201e', number: '201E', d: "M790 337L790 384L848 384L849 432L910 432L910 337Z", h: true, x: 880, y: 408, fs: 21.0, lw: 52 },
      { placeId: 'room-202', number: '202', d: "M672 434L672 484L749 483L749 434Z", h: true, x: 710, y: 459, fs: 24, lw: 70 },
      { placeId: 'room-203', number: '203', d: "M754 434L754 483L827 483L826 434Z", h: true, x: 790, y: 458, fs: 24, lw: 65 },
      { placeId: 'room-204', number: '204', d: "M832 434L832 483L908 483L907 433Z", h: true, x: 870, y: 458, fs: 24, lw: 68 },
      { placeId: 'room-207', number: '207', d: "M981 330L981 466L1020 466L1020 330Z", h: true, x: 1000, y: 398, fs: 24, lw: 31 },
      { placeId: 'room-206', number: '206', d: "M938 475L938 518L1019 518L1019 475Z", h: true, x: 978, y: 496, fs: 24, lw: 73 },
    ],
    icons: [
      { type: 'lift', x: 609, y: 419, r: 24 },
    ],
  },
  {
    id: 'third',
    number: 3,
    planAvailable: true,
    transform: 'translate(-13.0 190.4) scale(1.0782)',
    shell: "M1099 101L1096 94L1089 87L1078 83L1058 84L1050 90L1014 87L1012 118L913 118L770 114L762 112L762 86L758 78L746 69L726 68L713 74L707 83L705 89L706 113L704 115L669 115L667 137L563 134L562 138L553 139L540 138L539 134L478 137L477 115L418 114L417 76L387 76L386 113L375 114L373 116L184 116L183 113L122 113L96 111L94 102L84 90L73 86L59 86L49 90L41 98L38 106L38 123L42 133L48 139L59 143L79 142L85 139L95 126L109 127L110 138L151 138L152 174L178 174L182 139L200 138L201 144L207 147L207 159L201 163L201 187L362 187L361 138L373 137L386 139L386 178L412 178L421 184L446 185L447 189L621 189L621 183L627 181L628 177L635 177L638 185L647 185L648 189L681 189L681 164L688 163L694 168L696 177L714 178L714 191L757 191L757 140L779 138L781 190L952 190L953 140L1002 139L1003 153L1035 153L1035 141L1043 140L1044 133L1050 133L1058 139L1078 140L1089 136L1096 129L1099 122Z",
    walls: "M517.5 153L517.5 188M584.5 153L584.5 188M463 152L517 152M598 152L632 152M821.5 139L821.5 190M861.5 139L861.5 190M782 137.5L952 137.5",
    voids: [],
    spaces: [
      { d: "M92 122L112 124L113 135L154 135L155 171L175 171L179 133L184 135L203 134L204 141L210 144L211 161L204 166L204 184L268 184L268 158L261 158L260 152L262 147L267 145L269 141L270 119L181 119L180 116L119 116L93 114Z", h: true },
      { d: "M294 119L295 184L359 184L358 135L373 134L373 119Z", h: true },
      { d: "M709 116L708 135L719 136L717 188L754 188L754 137L766 136L766 116L750 116L737 122L725 121L718 116Z", h: false },
      { d: "M390 79L389 116L377 118L377 135L389 136L389 175L411 175L408 161L409 148L419 135L430 132L430 117L414 116L414 79Z", h: false },
      { d: "M1040 93L1017 90L1015 122L954 120L954 137L1006 136L1006 150L1032 150L1032 138L1040 137L1040 118L1045 117L1045 106L1040 105Z", h: false },
      { d: "M272 119L273 156L275 160L273 184L290 184L292 119Z", h: false },
      { d: "M691 140L691 160L697 165L698 173L714 174L714 140Z", h: false },
    ],
    rooms: [
      { placeId: 'room-300a', number: '300A', d: "M202 116L202 187L271 187L271 116Z", h: true, x: 236, y: 152, fs: 24, lw: 61 },
      { placeId: 'room-301', number: '301', d: "M435 118L435 153L452 154L452 188L586 188L587 153L703 153L703 118L667 118L666 137L571 134L475 137L474 118Z", h: true, x: 551, y: 170, fs: 21.0, lw: 58 },
      { placeId: 'room-301d', number: '301D', d: "M585 152L585 188L687 188L687 152Z", h: true, x: 636, y: 170, fs: 24, lw: 94 },
      { placeId: 'room-302', number: '302', d: "M781 115L781 190L952 190L952 115Z", h: true, x: 906, y: 164, fs: 21.0, lw: 80 },
    ],
    icons: [
      { type: 'stairs', x: 66, y: 115, r: 24 },
      { type: 'lift', x: 434, y: 157, r: 24 },
      { type: 'stairs', x: 734, y: 97, r: 24 },
      { type: 'stairs', x: 1071, y: 112, r: 24 },
    ],
  },
]

// ------------------------------------------------------------------ Places
// kind: zone (collection, not yet placed on the plan) | facility | area | room
// Names, labels and descriptions come from i18n (places.<id>.*); the English
// strings here are only a last-resort fallback.

export const zones = [
  { id: 'european-art', kind: 'zone', levelId: null, name: 'European Art 1300–1800' },
  { id: 'danish-golden-age', kind: 'zone', levelId: null, name: 'Danish Golden Age' },
  { id: 'modern-art', kind: 'zone', levelId: null, name: 'Modern Art' },
]

export const facilities = [
  { id: 'restrooms', kind: 'facility', levelId: 'ground', name: 'Restrooms' },
  { id: 'lockers', kind: 'facility', levelId: 'ground', name: 'Cloakroom' },
  { id: 'cafe', kind: 'facility', levelId: 'first', name: 'Café MAGNOLIA' },
  { id: 'shop', kind: 'facility', levelId: 'first', name: 'SMK Shop' },
  { id: 'biograf', kind: 'facility', levelId: 'ground', name: 'Cinema' },
]

export const areas = [
  { id: 'forhal', kind: 'area', levelId: 'first', name: 'Foyer' },
  { id: 'skulpturgaden', kind: 'area', levelId: 'first', name: 'Sculpture Street' },
  { id: 'scene', kind: 'area', levelId: 'first', name: 'Stage' },
  { id: 'auditorium', kind: 'area', levelId: 'first', name: 'Auditorium' },
]

// Every numbered room on the plans becomes a selectable place automatically.
const known = new Set([...zones, ...facilities, ...areas].map((p) => p.id))
const rooms = []
for (const level of levels) {
  for (const room of level.rooms) {
    if (!known.has(room.placeId)) {
      if (!room.number) throw new Error(`Room ${room.placeId} has no place entry`)
      known.add(room.placeId)
      rooms.push({ id: room.placeId, kind: 'room', levelId: level.id, number: room.number, name: room.number })
    }
  }
}

export const places = [...zones, ...facilities, ...areas, ...rooms]

// Place where a level's tab lands by default.
export const DEFAULT_PLACE = { ground: 'lockers', first: 'forhal', second: 'room-214', third: 'room-301' }

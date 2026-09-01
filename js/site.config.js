/* ------------------------------------------------------------------
   FROSTY HAVEN — SITE CONTENT CONFIG
   ------------------------------------------------------------------
   Everything the site says about the business lives here. Edit this
   one file and the page updates — no HTML or CSS to touch.

   Anything left as an empty string ('') or an empty array ([]) is
   automatically hidden. No "TBC", no dead links, no empty boxes.
   ------------------------------------------------------------------ */

window.FROSTY_HAVEN = {

  /* ---- Ordering -------------------------------------------------
     Orders are taken for pickup over WhatsApp. Swap this for an
     online-ordering link (Uber Eats, Deliveroo, your own page) any
     time — every "Order Now" button follows it. */
  orderUrl: 'https://wa.me/64211523246?text=' +
            encodeURIComponent("Hi Frosty Haven! I'd like to place a pickup order."),

  /* ---- Contact -------------------------------------------------- */
  contact: {
    phone: '021 152 3246',
    email: '',
    addressLines: ['202A Featherston Street', 'Palmerston North Central', 'Palmerston North 4410'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=202A+Featherston+Street+Palmerston+North+Central+Palmerston+North+4410',
    mapEmbedUrl: 'https://www.google.com/maps?q=202A+Featherston+Street,+Palmerston+North+Central,+Palmerston+North+4410&output=embed'
  },

  /* ---- Opening hours --------------------------------------------
     `closed: true` renders the day in the muted "closed" style.
     Add a second line to a day with an array of times. */
  hours: [
    { days: 'Sunday',    time: '11:30 am – 7:30 pm' },
    { days: 'Monday',    time: 'Closed', closed: true },
    { days: 'Tuesday',   time: '11:00 am – 7:30 pm' },
    { days: 'Wednesday', time: '11:00 am – 7:30 pm' },
    { days: 'Thursday',  time: '11:00 am – 9:30 pm' },
    { days: 'Friday',    time: ['11:00 am – 12:30 pm', '1:30 pm – 9:30 pm'] },
    { days: 'Saturday',  time: '11:30 am – 9:30 pm' }
  ],

  /* Local timezone used for the live Open / Closed badge. */
  timezone: 'Pacific/Auckland',

  /* ---- Social ---------------------------------------------------- */
  social: {
    instagram: 'https://www.instagram.com/frostyhaven.nz',
    tiktok: 'https://www.tiktok.com/@frostyhaven.nz',
    facebook: ''
  },

  /* ---- Site credit -----------------------------------------------
     The build credit in the footer. Clear `name` and the whole line
     goes; clear `url` and the name stays as plain text rather than a
     link that leads nowhere. */
  credit: {
    name: 'QuietM',
    url: 'https://www.instagram.com/quiet_.m3/'
  },

  /* ---- Ratings (shown beside the reviews) ------------------------ */
  ratings: [
    { score: '4.8', of: '5', label: 'Google', note: '62 reviews' },
    { score: '5.0', of: '5', label: 'Facebook', note: '2 votes' }
  ],

  /* ---- Reviews --------------------------------------------------
     Real Google reviews supplied by the shop. Nothing here is
     invented — add new ones in the same shape.

     Only genuine five-star reviews are listed, because the carousel
     shows five stars on every card. If you add a review with a lower
     rating, set its `stars` to the real number — the card renders
     exactly that many, never more. */
  reviewUrl: 'https://www.google.com/maps/place/frosty+haven/data=!4m2!3m1!1s0x6d41b3162a026301:0x3632c7572427c8a4?sa=X&ved=1t:242',
  reviews: [
      {
          "name": "Zena Fareen",
          "text": "Five Stars! Frosty Haven is an amazing spot for a treat. Their desserts are not only beautifully presented (seriously, they are photo-worthy!) but also taste incredible. The soft serve is creamy, and they have so many creative, delicious topping combinations. A must-try—I'll definitely be back!",
          "source": "Google",
          "when": "9 months ago",
          "stars": 5
      },
      {
          "name": "Jenny B.",
          "text": "Great ice cream with fantastic flavors and friendly staff. Creamy, and delicious soft serve with pistachio sauce. Highly recommend!!",
          "source": "Google",
          "when": "2 months ago",
          "stars": 5
      },
      {
          "name": "Ayla Duffy",
          "text": "I loved this place, reasonable pricing compared to other places similar. The staff are so friendly and kind and were the best part :) 10/10 will be coming here again (p.s the açai goes so well with Nutella 😉)",
          "source": "Google",
          "when": "5 months ago",
          "stars": 5
      },
      {
          "name": "Vivian De Almeida",
          "text": "Frosty Haven has delicious desserts! I especially love the Açaí because it reminds me of Açaí from Hawaii and Brazil. The thickshakes are actually thick😊 Each item I've eaten has been unforgettable. The owners of the dessert shop are attentive, kind, and great conversationalists. Recommend it 10/10",
          "source": "Google",
          "when": "3 months ago",
          "stars": 5
      },
      {
          "name": "Ayana Sue",
          "text": "I've tried juice up in Wellington and they are nowhere near as nice as this place. The acai flavour is very strong and really nice. 10/10 would reccomend. Owners are lovely",
          "source": "Google",
          "when": "a month ago",
          "stars": 5
      },
      {
          "name": "Racheal Millar",
          "text": "A friend recommended this place for our girls' night out, and wow. The loaded brownie was absolutely divine and left me speechless. It's officially my new favourite dessert spot.",
          "source": "Google",
          "when": "7 months ago",
          "stars": 5
      },
      {
          "name": "Chantelle Cundy",
          "text": "Honestly the best dessert we've ever had, will keep coming back and recommending to everyone we know. Perfect combo, crunch and flavour, the owner is so lovely and kind also! They stayed open later just for us and insisted to stay and eat amazing! 100 out of 10 thank you guys!",
          "source": "Google",
          "when": "3 weeks ago",
          "stars": 5
      },
      {
          "name": "bailey woodman",
          "text": "My partner and I went last night and tried some of the Croffles. I had Biscoff and he had the Pistachio. Both were amazing, 10/10. The service was quick and the croffle itself was crunchy and filling. I would recommend to anyone wanting a late night dessert to go try it out. Also the owners were super nice to talk to.",
          "source": "Google",
          "when": "a month ago",
          "stars": 5
      },
      {
          "name": "Amelia Chappell",
          "text": "Lots of great dessert options and a lot of them are very reasonably priced. We tried a Biscoff Flurr, a Pistachio Flurr, Cookie with biscoff toppings, Strawberry thickshake, and vanilla soft serve with sprinkles. Everyone was happy with their choices. They were a bit rich by the end, but otherwise very happy and would visit again!",
          "source": "Google",
          "when": "2 weeks ago",
          "stars": 5
      },
      {
          "name": "Talitha Mao-Adams",
          "text": "I love the flavours here and the Acai is the best! The owners are very friendly and accommodating- only danger to my wallet.",
          "source": "Google",
          "when": "a month ago",
          "stars": 5
      },
      {
          "name": "Shontelle Wihare",
          "text": "Desserts and Milkshakes are amazing!! Such friendly service as well!! Definitely recommend the brownie with pistachio sauce!! My fav shop when I have a sweet tooth!!",
          "source": "Google",
          "when": "5 months ago",
          "stars": 5
      },
      {
          "name": "Mamaray",
          "text": "Excellent customer service. Lovely people. And omg the biscoff flurr.. amazing. I need to come back",
          "source": "Google",
          "when": "5 months ago",
          "stars": 5
      },
      {
          "name": "Shontelle Rose Peeti",
          "text": "We had the cookie with soft serve, Dubai sauce and crushed flake so yum absolutely loved it and the service was exceptional 👌",
          "source": "Google",
          "when": "8 months ago",
          "stars": 5
      },
      {
          "name": "libby sheppard",
          "text": "Sooo yummy, I had the Nutella Flurr and it was so good. I would so come here again with some friends and the prices are so reasonable",
          "source": "Google",
          "when": "2 months ago",
          "stars": 5
      },
      {
          "name": "Carlo Joshua Abu",
          "text": "Quality food and the worker was very friendly. We ordered the new croffle pancake and it was delicious!",
          "source": "Google",
          "when": "3 months ago",
          "stars": 5
      },
      {
          "name": "japman sidhu",
          "text": "Quality food and service. We had the biscoff and pistachio croffle. 💯",
          "source": "Google",
          "when": "3 months ago",
          "stars": 5
      },
      {
          "name": "ThreeHunna 751",
          "text": "Best ice cream and brownies ive ever had. Definitely coming here more.",
          "source": "Google",
          "when": "6 months ago",
          "stars": 5
      },
      {
          "name": "Jess Sunnex",
          "text": "It was really nice here. Friendly service, and great atmosphere. The drink was really nice and the flurr was great also.",
          "source": "Google",
          "when": "6 months ago",
          "stars": 5
      },
      {
          "name": "Shayna Poaneki",
          "text": "Loved this spot, exceptional cheese cake and brownie combo.",
          "source": "Google",
          "when": "6 months ago",
          "stars": 5
      },
      {
          "name": "Livvy",
          "text": "Cheesecake was delicious, strawberry's and passion fruit topping! The base is lose crumble and the cheesecake filling is light and fluffy!",
          "source": "Google",
          "when": "9 months ago",
          "stars": 5
      },
      {
          "name": "Joshua",
          "text": "Great experience! The cheesecake was so yum. Highly recommend💯",
          "source": "Google",
          "when": "7 months ago",
          "stars": 5
      },
      {
          "name": "Steph Anie",
          "text": "Incredible. The owners are friendly and super helpful!",
          "source": "Google",
          "when": "6 months ago",
          "stars": 5
      },
      {
          "name": "Goofy Ahhh",
          "text": "So yummy, very nice owners. SO WORTH IT AND FULLING!!",
          "source": "Google",
          "when": "8 months ago",
          "stars": 5
      },
      {
          "name": "rose singh",
          "text": "Very nice and delicious\nService very friendly and helpful\nWill see you again",
          "source": "Google",
          "when": "9 months ago",
          "stars": 5
      },
      {
          "name": "VJ Woollett",
          "text": "Absolutely delicious. And wonderful friendly service. We will be back.",
          "source": "Google",
          "when": "a week ago",
          "stars": 5
      },
      {
          "name": "Courtney Thompson",
          "text": "Super yummy treat. Lots of great options to suit every sweet tooth. Loved the warm brownie and ice cream. Will be back to try other things in future. Not a lot of seating inside, but it wasn't busy when we popped in. Friendly service, staff were helpful with my questions",
          "source": "Google",
          "when": "3 weeks ago",
          "stars": 5
      },
      {
          "name": "Palmy NBJ",
          "text": "Very cute place with attentive owners. Priced fairly too. We loved the dessert nachos 😋",
          "source": "Google",
          "when": "4 weeks ago",
          "stars": 5
      },
      {
          "name": "cheyenne potter",
          "text": "Biscoff waffle is elite. Friendly staff. Definitely recommend and pricing is on the cheaper to standard price range.",
          "source": "Google",
          "when": "a month ago",
          "stars": 5
      }
  ]
};

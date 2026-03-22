// keystatic.config.ts
import { config, fields, collection, singleton } from '@keystatic/core';

const isLocal = import.meta.env.DEV;
const storage = isLocal
  ? { kind: 'local' as const }
  : { kind: 'cloud' as const };

export default config({
  storage,
  singletons: {
    siteSettings: singleton({
      label: 'Nastavenia stránky',
      path: 'src/content/settings/site',
      schema: {
        siteName: fields.text({ label: 'Názov stránky', validation: { isRequired: true } }),
        siteDescription: fields.text({ label: 'Popis stránky (SEO)', multiline: true }),
        logo: fields.image({ label: 'Logo', directory: 'public/images', publicPath: '/images' }),
        contactEmail: fields.text({ label: 'Kontaktný email' }),
        phone: fields.text({ label: 'Telefón' }),
        address: fields.text({ label: 'Adresa' }),
        openingHours: fields.text({ label: 'Otváracie hodiny', defaultValue: 'Po–Pi: 7:00 – 15:30' }),
      },
    }),
    homepage: singleton({
      label: 'Domovská stránka',
      path: 'src/content/pages/home',
      schema: {
        heroBadge: fields.text({ label: 'Hero badge text', defaultValue: 'Slovenská výroba' }),
        heroTitle: fields.text({ label: 'Hero nadpis', validation: { isRequired: true } }),
        heroSubtitle: fields.text({ label: 'Hero podnadpis', multiline: true }),
        heroImage: fields.image({ label: 'Hero obrázok', directory: 'public/images/hero', publicPath: '/images/hero' }),
        ctaText: fields.text({ label: 'CTA tlačidlo text', defaultValue: 'Katalóg produktov' }),
        ctaLink: fields.text({ label: 'CTA tlačidlo odkaz', defaultValue: '/produkty' }),
        cta2Text: fields.text({ label: '2. tlačidlo text', defaultValue: 'Kontaktujte nás' }),
        cta2Link: fields.text({ label: '2. tlačidlo odkaz', defaultValue: '/kontakt' }),
        heroStats: fields.array(
          fields.object({
            number: fields.text({ label: 'Číslo / hodnota' }),
            label: fields.text({ label: 'Popis' }),
          }),
          { label: 'Hero štatistiky', itemLabel: (props) => props.fields.number.value || 'Nová' }
        ),
        features: fields.array(
          fields.object({
            title: fields.text({ label: 'Nadpis' }),
            description: fields.text({ label: 'Popis', multiline: true }),
          }),
          { label: 'Výhody (4 boxy)', itemLabel: (props) => props.fields.title.value || 'Nová' }
        ),
        productsLabel: fields.text({ label: 'Produkty sekcia label', defaultValue: 'Katalóg produktov' }),
        productsTitle: fields.text({ label: 'Produkty sekcia nadpis', defaultValue: 'Náhradné diely pre motory URII a URIV' }),
        productsBtnText: fields.text({ label: 'Všetky produkty tlačidlo', defaultValue: 'Všetky produkty' }),
        productCardLink: fields.text({ label: 'Text odkazu na produkte', defaultValue: 'Viac info' }),
        blogLabel: fields.text({ label: 'Blog sekcia label', defaultValue: 'Blog' }),
        blogTitle: fields.text({ label: 'Blog sekcia nadpis', defaultValue: 'Technické články' }),
        blogCardLink: fields.text({ label: 'Text odkazu na článku', defaultValue: 'Čítať' }),
        ctaBottomTitle: fields.text({ label: 'CTA sekcia nadpis' }),
        ctaBottomText: fields.text({ label: 'CTA sekcia text', multiline: true }),
        ctaBottomBtnText: fields.text({ label: 'CTA sekcia tlačidlo', defaultValue: 'Napíšte nám' }),
      },
    }),
    aboutPage: singleton({
      label: 'Stránka O nás',
      path: 'src/content/pages/about',
      schema: {
        heroLabel: fields.text({ label: 'Hero label', defaultValue: 'O nás' }),
        heroTitle: fields.text({ label: 'Hero nadpis', validation: { isRequired: true } }),
        heroAccent: fields.text({ label: 'Hero zelený text' }),
        heroDesc: fields.text({ label: 'Hero popis', multiline: true }),
        stats: fields.array(
          fields.object({
            number: fields.text({ label: 'Číslo / hodnota' }),
            label: fields.text({ label: 'Popis' }),
          }),
          { label: 'Štatistiky', itemLabel: (props) => props.fields.number.value || 'Nová' }
        ),
        whoWeAreTitle: fields.text({ label: 'Kto sme - nadpis', defaultValue: 'Kto sme' }),
        whoWeAreText: fields.text({ label: 'Kto sme - text', multiline: true }),
        features: fields.array(
          fields.object({
            title: fields.text({ label: 'Nadpis' }),
            description: fields.text({ label: 'Popis', multiline: true }),
          }),
          { label: 'Výhody karty', itemLabel: (props) => props.fields.title.value || 'Nová' }
        ),
        whatWeDoTitle: fields.text({ label: 'Čo vyrábame - nadpis', defaultValue: 'Čo vyrábame' }),
        whatWeDoText: fields.text({ label: 'Čo vyrábame - text', multiline: true }),
        productList: fields.array(
          fields.text({ label: 'Produkt' }),
          { label: 'Zoznam produktov', itemLabel: (props) => props.value || 'Nový' }
        ),
        forWhomTitle: fields.text({ label: 'Pre koho - nadpis', defaultValue: 'Pre koho vyrábame' }),
        applications: fields.array(
          fields.object({
            title: fields.text({ label: 'Názov' }),
            description: fields.text({ label: 'Popis' }),
          }),
          { label: 'Aplikácie', itemLabel: (props) => props.fields.title.value || 'Nová' }
        ),
        ctaTitle: fields.text({ label: 'CTA nadpis' }),
        ctaText: fields.text({ label: 'CTA text', multiline: true }),
        ctaBtnText: fields.text({ label: 'CTA tlačidlo', defaultValue: 'Kontaktujte nás' }),
      },
    }),
    contactPage: singleton({
      label: 'Stránka Kontakt',
      path: 'src/content/pages/contact',
      schema: {
        heroLabel: fields.text({ label: 'Hero label', defaultValue: 'Kontakt' }),
        heroTitle: fields.text({ label: 'Hero nadpis', validation: { isRequired: true } }),
        heroAccent: fields.text({ label: 'Hero zelený text' }),
        heroDesc: fields.text({ label: 'Hero popis', multiline: true }),
        phoneCardTitle: fields.text({ label: 'Karta telefón nadpis', defaultValue: 'Telefón' }),
        phoneCardSub: fields.text({ label: 'Karta telefón podnápis', defaultValue: 'Po–Pi: 7:00 – 15:30' }),
        emailCardTitle: fields.text({ label: 'Karta email nadpis', defaultValue: 'Email' }),
        emailCardSub: fields.text({ label: 'Karta email podnápis', defaultValue: 'Odpovieme do 24 hodín' }),
        addressCardTitle: fields.text({ label: 'Karta adresa nadpis', defaultValue: 'Adresa' }),
        formTitle: fields.text({ label: 'Formulár nadpis', defaultValue: 'Napíšte nám' }),
        formBtnText: fields.text({ label: 'Formulár tlačidlo', defaultValue: 'Odoslať dopyt' }),
        mapTitle: fields.text({ label: 'Mapa nadpis', defaultValue: 'Kde nás nájdete' }),
        mapAddress: fields.text({ label: 'Adresa prevádzky' }),
        mapEmbedUrl: fields.text({ label: 'Google Maps embed URL' }),
        formSubjects: fields.array(
          fields.text({ label: 'Možnosť' }),
          { label: 'Predmety formulára', itemLabel: (props) => props.value || 'Nový' }
        ),
      },
    }),
    productsPage: singleton({
      label: 'Stránka Produkty',
      path: 'src/content/pages/products-settings',
      schema: {
        heroLabel: fields.text({ label: 'Hero label', defaultValue: 'Katalóg produktov' }),
        heroTitle: fields.text({ label: 'Hero nadpis' }),
        heroAccent: fields.text({ label: 'Hero zelený text' }),
        heroDesc: fields.text({ label: 'Hero popis', multiline: true }),
        detailBackText: fields.text({ label: 'Späť text', defaultValue: 'Všetky produkty' }),
        detailInquiryBtn: fields.text({ label: 'Dopyt tlačidlo', defaultValue: 'Dopyt na tento diel' }),
        detailCtaTitle: fields.text({ label: 'CTA nadpis', defaultValue: 'Potrebujete tento diel?' }),
        detailCtaText: fields.text({ label: 'CTA text', defaultValue: 'Kontaktujte obchodný tím pre overenie kompatibility a cenovú ponuku.' }),
        detailCtaBtn: fields.text({ label: 'CTA tlačidlo', defaultValue: 'Odoslať dopyt' }),
        cardLinkText: fields.text({ label: 'Text odkazu na karte', defaultValue: 'Technické detaily' }),
      },
    }),
    blogPage: singleton({
      label: 'Stránka Blog',
      path: 'src/content/pages/blog-settings',
      schema: {
        heroLabel: fields.text({ label: 'Hero label', defaultValue: 'Blog' }),
        heroTitle: fields.text({ label: 'Hero nadpis' }),
        heroAccent: fields.text({ label: 'Hero zelený text' }),
        heroDesc: fields.text({ label: 'Hero popis', multiline: true }),
        detailBackText: fields.text({ label: 'Späť text', defaultValue: 'Všetky články' }),
        detailCtaTitle: fields.text({ label: 'CTA nadpis', defaultValue: 'Máte otázku k tomuto článku?' }),
        detailCtaText: fields.text({ label: 'CTA text', defaultValue: 'Naši technici vám radi poradia.' }),
        detailCtaBtn: fields.text({ label: 'CTA tlačidlo', defaultValue: 'Kontaktujte nás' }),
        cardLinkText: fields.text({ label: 'Text odkazu na karte', defaultValue: 'Čítať článok' }),
      },
    }),
    navigation: singleton({
      label: 'Navigácia',
      path: 'src/content/settings/navigation',
      schema: {
        items: fields.array(
          fields.object({
            label: fields.text({ label: 'Text odkazu' }),
            href: fields.text({ label: 'URL' }),
            isExternal: fields.checkbox({ label: 'Externý odkaz', defaultValue: false }),
          }),
          { label: 'Položky menu', itemLabel: (props) => props.fields.label.value || 'Nová položka' }
        ),
      },
    }),
    footer: singleton({
      label: 'Footer',
      path: 'src/content/settings/footer',
      schema: {
        copyrightText: fields.text({ label: 'Copyright text', defaultValue: 'Martin Diesel' }),
        createdBy: fields.text({ label: 'Vytvoril (meno)', defaultValue: 'FerkoMedia' }),
        createdByUrl: fields.text({ label: 'Vytvoril (URL)', defaultValue: 'https://ferkomedia.sk' }),
        sectionProductsTitle: fields.text({ label: 'Nadpis sekcie Produkty', defaultValue: 'Produkty' }),
        sectionPagesTitle: fields.text({ label: 'Nadpis sekcie Stránky', defaultValue: 'Stránky' }),
        sectionContactTitle: fields.text({ label: 'Nadpis sekcie Kontakt', defaultValue: 'Kontakt' }),
        productLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'URL' }),
          }),
          { label: 'Produktové linky', itemLabel: (props) => props.fields.label.value || 'Nový' }
        ),
      },
    }),
  },
  collections: {
    services: collection({
      label: 'Produkty',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.slug({ name: { label: 'Názov produktu' } }),
        catalogNumber: fields.text({ label: 'Katalógové číslo' }),
        shortDescription: fields.text({ label: 'Krátky popis', multiline: true }),
        featuredImage: fields.image({ label: 'Obrázok produktu', directory: 'public/images/products', publicPath: '/images/products' }),
        videoUrl: fields.text({ label: 'Video URL (YouTube, Cloudinary alebo priamy link)' }),
        gallery: fields.array(
          fields.image({ label: 'Obrázok', directory: 'public/images/products', publicPath: '/images/products' }),
          { label: 'Galéria obrázkov' }
        ),
        category: fields.select({
          label: 'Kategória',
          options: [
            { label: 'Bloky motorov', value: 'bloky' },
            { label: 'Hlavy valcov', value: 'hlavy' },
            { label: 'Vačkové hriadele', value: 'hriadele' },
            { label: 'Olejové vane', value: 'vane' },
            { label: 'Čapy a zdvíhadlá', value: 'capy' },
            { label: 'Súbory komponentov', value: 'subory' },
          ],
          defaultValue: 'bloky',
        }),
        motorType: fields.select({
          label: 'Typ motora',
          options: [
            { label: 'URII', value: 'urii' },
            { label: 'URIV', value: 'uriv' },
            { label: 'Oboje', value: 'both' },
          ],
          defaultValue: 'both',
        }),
        featured: fields.checkbox({ label: 'Zobrazovať na hlavnej stránke', defaultValue: true }),
        order: fields.integer({ label: 'Poradie', defaultValue: 0 }),
        description: fields.markdoc({
          label: 'Detailný popis',
          options: { image: { directory: 'public/images/products', publicPath: '/images/products' } },
        }),
      },
    }),
    posts: collection({
      label: 'Blog / Technické články',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Nadpis' } }),
        publishDate: fields.date({ label: 'Dátum publikovania', validation: { isRequired: true } }),
        excerpt: fields.text({ label: 'Krátky popis', multiline: true }),
        featuredImage: fields.image({ label: 'Hlavný obrázok', directory: 'public/images/blog', publicPath: '/images/blog' }),
        category: fields.select({
          label: 'Kategória',
          options: [
            { label: 'Technické články', value: 'technicke' },
            { label: 'Novinky', value: 'novinky' },
            { label: 'Návody', value: 'navody' },
          ],
          defaultValue: 'technicke',
        }),
        draft: fields.checkbox({ label: 'Koncept', defaultValue: false }),
        content: fields.markdoc({
          label: 'Obsah',
          options: { image: { directory: 'public/images/blog', publicPath: '/images/blog' } },
        }),
      },
    }),
    pages: collection({
      label: 'Stránky',
      slugField: 'title',
      path: 'src/content/custom-pages/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Názov stránky' } }),
        seoTitle: fields.text({ label: 'SEO titulok' }),
        seoDescription: fields.text({ label: 'SEO popis', multiline: true }),
        content: fields.markdoc({ label: 'Obsah' }),
      },
    }),
    testimonials: collection({
      label: 'Referencie',
      slugField: 'name',
      path: 'src/content/testimonials/*',
      schema: {
        name: fields.slug({ name: { label: 'Meno / Firma' } }),
        company: fields.text({ label: 'Firma' }),
        quote: fields.text({ label: 'Citát', multiline: true, validation: { isRequired: true } }),
        rating: fields.integer({ label: 'Hodnotenie (1-5)', defaultValue: 5, validation: { min: 1, max: 5 } }),
      },
    }),
  },
});

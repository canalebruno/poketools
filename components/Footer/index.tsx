import styles from "./styles.module.scss";

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <a href="https://ko-fi.com/P5P7K5F3E" rel="noreferrer" target="_blank">
          <img
            height="36px"
            style={{ border: 0, height: "36px" }}
            src="https://storage.ko-fi.com/cdn/kofi3.png?v=3"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      </div>
    </div>
  );
}
